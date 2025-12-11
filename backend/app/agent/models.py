from pydantic import BaseModel, Field
from typing import List, Dict, Any

class RunRequest(BaseModel):
    goal: str

class RunResponse(BaseModel):
    run_id: str
    status: str

class TaskNode(BaseModel):
    id: str
    title: str
    type: str
    payload: Dict[str, Any] = Field(default_factory=dict)
    status: str = "pending"  # pending, running, success, failed
    result: Dict[str, Any] = Field(default_factory=dict)
    created_at: float | None = None
    started_at: float | None = None
    finished_at: float | None = None
