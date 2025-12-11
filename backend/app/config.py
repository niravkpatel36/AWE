from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_HOST: str = "0.0.0.0"
    APP_PORT: int = 8000
    OLLAMA_URL: str = "http://localhost:11434"  # local inference endpoint
    QDRANT_URL: str = "http://localhost:6333"
    QDRANT_API_KEY: str | None = None
    SANDBOX_IMAGE: str = "awe_sandbox:latest"
    SANDBOX_TIMEOUT: int = 30
    PLAYWRIGHT_BROWSERS_PATH: str | None = None

    class Config:
        env_file = ".env"

settings = Settings()
