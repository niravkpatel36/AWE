from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import uuid
from app.agent.planner import Planner
from app.agent.executor import Executor
from app.ws_manager import manager
from app.agent.models import RunRequest, RunResponse
from app.agent.graph_state import GraphState

router = APIRouter()
planner = Planner()
executor = Executor(manager)

# store graph states in memory for demo; production should persist
_graph_store: dict = {}

@router.post("/run", response_model=RunResponse)
async def run_endpoint(req: RunRequest):
    run_id = str(uuid.uuid4())
    plan = await planner.decompose(req.goal, run_id)
    graph = GraphState(run_id=run_id, nodes=plan["nodes"], edges=plan["edges"], meta={"goal": req.goal})
    _graph_store[run_id] = graph
    # start executor in background
    executor_task = executor.start(run_id, graph)
    return RunResponse(run_id=run_id, status="started")

@router.get("/graph-state/{run_id}")
async def graph_state(run_id: str):
    g = _graph_store.get(run_id)
    if not g:
        raise HTTPException(status_code=404, detail="run not found")
    return g
