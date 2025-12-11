import os
from pathlib import Path
import aiofiles
from typing import Dict, Any

BASE_SANDBOX_DIR = Path("/tmp/awe_files")

class FileTool:
    def __init__(self):
        BASE_SANDBOX_DIR.mkdir(parents=True, exist_ok=True)

    async def read(self, path: str) -> Dict[str, Any]:
        safe_path = BASE_SANDBOX_DIR.joinpath(Path(path).name)
        if not safe_path.exists():
            return {"status": "not_found"}
        async with aiofiles.open(safe_path, "r") as f:
            content = await f.read()
        return {"status": "ok", "content": content}

    async def write(self, path: str, content: str) -> Dict[str, Any]:
        safe_path = BASE_SANDBOX_DIR.joinpath(Path(path).name)
        async with aiofiles.open(safe_path, "w") as f:
            await f.write(content)
        return {"status": "ok", "path": str(safe_path)}
