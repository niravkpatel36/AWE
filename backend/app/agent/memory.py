from qdrant_client import QdrantClient
from qdrant_client.models import VectorParams, Distance
from app.config import settings
import numpy as np
import uuid

class Memory:
    def __init__(self):
        self.client = QdrantClient(url=settings.QDRANT_URL, api_key=settings.QDRANT_API_KEY)
        # ensure collection exists
        try:
            self.client.recreate_collection(collection_name="awe_memory", vectors_config=VectorParams(size=1536, distance=Distance.COSINE))
        except Exception:
            pass

    def embed(self, text: str) -> list:
        # placeholder: in production call the LLM embedding endpoint or local embedder
        # simple deterministic hash-based vector for demo (replace for prod)
        arr = np.random.RandomState(abs(hash(text)) % (2**32)).randn(1536).astype(float)
        return arr.tolist()

    def upsert(self, payload: dict, text: str):
        vec = self.embed(text)
        point_id = str(uuid.uuid4())
        self.client.upsert(collection_name="awe_memory", points=[{"id": point_id, "vector": vec, "payload": payload}])
        return point_id

    def query(self, text: str, top_k: int = 4):
        vec = self.embed(text)
        res = self.client.search(collection_name="awe_memory", query_vector=vec, limit=top_k)
        return res
