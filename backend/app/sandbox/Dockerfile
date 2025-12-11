FROM python:3.11-slim

# limit packages and remove network access at runtime via docker flags
WORKDIR /app

# minimal runtime deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# no pip installs of user packages here; keep container minimal
COPY runner.py /app/runner.py
CMD ["python", "/app/runner.py"]
