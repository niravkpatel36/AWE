from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Set
import asyncio
import json

router = APIRouter()
# simple in-memory manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, run_id: str, websocket: WebSocket):
        await websocket.accept()
        conns = self.active_connections.setdefault(run_id, set())
        conns.add(websocket)

    def disconnect(self, run_id: str, websocket: WebSocket):
        conns = self.active_connections.get(run_id)
        if conns:
            conns.discard(websocket)
            if not conns:
                self.active_connections.pop(run_id, None)

    async def broadcast(self, run_id: str, message: dict):
        conns = self.active_connections.get(run_id, set())
        to_remove = []
        for ws in list(conns):
            try:
                await ws.send_json(message)
            except Exception:
                to_remove.append(ws)
        for ws in to_remove:
            self.disconnect(run_id, ws)

manager = ConnectionManager()

@router.websocket("/stream/{run_id}")
async def stream_endpoint(websocket: WebSocket, run_id: str):
    await manager.connect(run_id, websocket)
    try:
        while True:
            await websocket.receive_text()  # keepalive / ignore payloads
    except WebSocketDisconnect:
        manager.disconnect(run_id, websocket)
