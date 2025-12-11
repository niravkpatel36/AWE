import asyncio
from playwright.async_api import async_playwright
from app.config import settings

class BrowserTool:
    def __init__(self):
        pass

    async def run(self, instruction: dict):
        # instruction: {"url": "...", "script": "..."} optional
        async with async_playwright() as p:
            browser = await p.chromium.launch(headless=True)
            context = await browser.new_context()
            page = await context.new_page()
            url = instruction.get("url")
            if url:
                await page.goto(url, wait_until="load", timeout=15000)
            script = instruction.get("script")
            result = {}
            if script:
                # evaluate script
                evaluated = await page.evaluate(script)
                result["eval"] = evaluated
            else:
                result["content"] = await page.content()
            await browser.close()
            return {"status": "ok", "data": result}
