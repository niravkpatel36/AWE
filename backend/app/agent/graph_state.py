from pydantic import BaseModel
from typing import List, Dict, Any
from time import time
from app.agent.models import TaskNode

class GraphState(BaseModel):
    run_id: str
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    meta: Dict[str, Any] = {}
    created_at: float | None = None

    def __init__(self, **data):
        super().__init__(**data)
        if self.created_at is None:
            self.created_at = time()

    def update_node(self, node_id: str, **kwargs):
        for n in self.nodes:
            if n["id"] == node_id:
                n.update(kwargs)
                return n
        return None
