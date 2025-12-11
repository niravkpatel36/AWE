import httpx
from typing import Dict, Any

class HTTPTool:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=20)

    async def get(self, url: str) -> Dict[str, Any]:
        resp = await self.client.get(url)
        return {"status": resp.status_code, "text": resp.text, "headers": dict(resp.headers)}
