from fastapi import FastAPI
from app.api import router as api_router
from app.ws_manager import router as websocket_router
import uvicorn
from app.config import settings

app = FastAPI(title="AWE - Autonomous Workflow Engineer")
app.include_router(api_router, prefix="/api")
app.include_router(websocket_router, prefix="/ws")

@app.get("/")
async def root():
    return {"service": "AWE Backend", "status": "ok"}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host=settings.APP_HOST, port=settings.APP_PORT, reload=False)
