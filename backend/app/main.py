from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import router as api_router
from app.ws_manager import router as websocket_router

app = FastAPI(title="AWE - Autonomous Workflow Engineer")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://awe-production-ee2d.up.railway.app",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")
app.include_router(websocket_router, prefix="/ws")

@app.get("/")
async def root():
    return {"service": "AWE Backend", "status": "ok"}


