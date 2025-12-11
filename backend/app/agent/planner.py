import asyncio
import uuid
from typing import Dict, Any
from app.agent.memory import Memory
from app.config import settings
import time

class Planner:
    def __init__(self):
        self.memory = Memory()

    async def decompose(self, goal: str, run_id: str) -> Dict[str, Any]:
        # very simple heuristic-based task decomposer.
        # In production: call local LLM for better breakdown.
        root_id = f"{run_id}-root"
        nodes = []
        edges = []
        # naive split: sentences -> tasks
        sentences = [s.strip() for s in goal.split('.') if s.strip()]
        if not sentences:
            sentences = [goal]
        for i, s in enumerate(sentences):
            node_id = f"{run_id}-task-{i}"
            nodes.append({
                "id": node_id,
                "title": s[:120],
                "type": "action",
                "payload": {"instruction": s},
                "status": "pending",
                "result": {}
            })
            if i > 0:
                edges.append({"from": f"{run_id}-task-{i-1}", "to": node_id})
        # add finalize node
        final_id = f"{run_id}-final"
        nodes.append({
            "id": final_id,
            "title": "Finalize & summarize",
            "type": "finalize",
            "payload": {"instruction": "Summarize results and produce next steps."},
            "status": "pending",
            "result": {}
        })
        if nodes:
            edges.append({"from": nodes[-2]["id"], "to": final_id})
        plan = {"nodes": nodes, "edges": edges}
        # store summary in memory
        self.memory.upsert({"run_id": run_id, "plan": plan}, goal)
        await asyncio.sleep(0.05)
        return plan
