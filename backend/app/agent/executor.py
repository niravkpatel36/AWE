import asyncio
from app.agent.tools.browser_tool import BrowserTool
from app.agent.tools.file_tool import FileTool
from app.agent.tools.http_tool import HTTPTool
from typing import Dict, Any
from time import time
import traceback
import json

class Executor:
    def __init__(self, ws_manager):
        self.ws_manager = ws_manager
        # tools
        self.browser = BrowserTool()
        self.file_tool = FileTool()
        self.http_tool = HTTPTool()
        self.docker = None

    async def start(self, run_id: str, graph):
        await self._run_graph(run_id, graph)

    async def _run_graph(self, run_id: str, graph):
        # naive topological: execute in order in nodes list respecting edges
        id_to_node = {n["id"]: n for n in graph.nodes}
        # simple loop: run nodes when predecessors done
        edges_from = {}
        preds = {n["id"]: set() for n in graph.nodes}
        for e in graph.edges:
            preds[e["to"]].add(e["from"])
            edges_from.setdefault(e["from"], []).append(e["to"])

        pending = set(id_to_node.keys())
        while pending:
            progress = False
            for node_id in list(pending):
                if preds[node_id] - set():  # cannot run if predecessors pending
                    if any(p in pending for p in preds[node_id]):
                        continue
                node = id_to_node[node_id]
                # run node
                await self._update_node(run_id, node_id, {"status": "running", "started_at": time()})
                result = await self._execute_node(node)
                status = "success" if result.get("status") in ("ok", "done") else "failed"
                await self._update_node(run_id, node_id, {"status": status, "result": result, "finished_at": time()})
                pending.discard(node_id)
                progress = True
                # broadcast update
                await self.ws_manager.broadcast(run_id, {"type": "node_update", "node": node_id, "status": status, "result": result})
            if not progress:
                # circular dependency or blocked: break
                break

    async def _execute_node(self, node: Dict[str, Any]):
        try:
            typ = node.get("type", "action")
            payload = node.get("payload", {})
            if payload.get("tool") == "browser" or typ == "browser":
                return await self.browser.run(payload)
            if payload.get("tool") == "http" or typ == "http":
                return await self.http_tool.get(payload.get("url"))
            if payload.get("tool") == "file" or typ == "file":
                if payload.get("op") == "read":
                    return await self.file_tool.read(payload.get("path"))
                else:
                    return await self.file_tool.write(payload.get("path"), payload.get("content", ""))
            if payload.get("tool") == "docker" or typ == "docker":
                code = payload.get("code", "# no-op")
                return self.docker.run_code(code, timeout=30)
            # default: call LLM to produce action (placeholder)
            return {"status": "ok", "note": "no-op executed"}
        except Exception as e:
            traceback.print_exc()
            return {"status": "error", "error": str(e)}
    async def _update_node(self, run_id: str, node_id: str, updates: dict):
        # In-memory update: in real system persist to datastore
        # send websocket update
        await self.ws_manager.broadcast(run_id, {"type": "node_state", "node_id": node_id, "updates": updates})
