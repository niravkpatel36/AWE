from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from app.config import settings
import numpy as np
import uuid

# app/agent/memory.py
class Memory:
    def __init__(self):
        self.memory = []  # simple in-memory list

    def upsert(self, payload: dict, text: str):
        self.memory.append({"payload": payload, "text": text})

    def search(self, text: str, limit: int = 5):
        return self.memory[-limit:]

