# AWE (Autonomous Workflow Engine)

AWE is an autonomous execution system that transforms high-level goals into structured, observable, and repeatable workflows. It decomposes intent into discrete steps, executes them programmatically, and exposes real-time progress through a directed execution graph.

The system is designed for engineers building, evaluating, or demonstrating agentic systems where transparency, determinism, and architectural clarity matter as much as autonomy itself.

## Table of Contents
- [About](#about)
- [System Overview](#system-overview)
- [Architecture](#architecture)
- [Execution Model](#execution-model)
- [API Overview](#api-overview)
- [Frontend](#frontend)
- [Local Development](#local-development)
- [Environment Configuration](#environment-configuration)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Engineering Principles](#engineering-principles)
- [Roadmap](#roadmap)
- [License](#license)

## About

AWE provides an execution substrate for autonomous reasoning and task orchestration. Users submit a single high-level objective, and AWE expands that objective into an explicit execution plan represented as a Directed Acyclic Graph (DAG). Each node in the graph corresponds to a concrete unit of work with well-defined inputs, outputs, and lifecycle state.

The platform emphasizes three core principles:

- **Explicit Structure**  
  All reasoning and execution is materialized as graph nodes and edges. Nothing is implicit, hidden, or transient.
  
- **Live Observability**  
  Execution state is streamed in real time, enabling users to inspect progress, dependencies, failures, and recovery paths as they occur.

- **Deterministic Control Surfaces**  
  Every execution step is addressable, restartable, and auditable. The system is designed to support both experimentation and production-grade workflows.

AWE is suitable for technical demonstrations, internal tooling, research environments, and systems engineering interviews where architectural clarity and execution transparency are critical.

## System Overview

At a high level, AWE consists of three layers:

- **Execution Engine**  
  Responsible for goal decomposition, task scheduling, and lifecycle management.
  
- **API and Realtime Layer**  
  Exposes REST and WebSocket interfaces for submitting goals, streaming execution events, and querying system state.

- **Client Interface**  
  A frontend that visualizes the execution DAG, task states, and live progress.

All components are modular and designed for extension.

## Architecture

### Backend

The backend is built on FastAPI and provides both HTTP and WebSocket interfaces.

Core responsibilities include:

- Accepting high-level goals
- Decomposing goals into executable steps
- Constructing and managing the execution DAG
- Running tasks asynchronously
- Streaming execution updates to connected clients

Key characteristics include:

- Asynchronous, non-blocking execution model
- Clear separation between orchestration, execution, and transport layers
- Designed for stateless API deployment with externalized state where needed

### Frontend

The frontend is a React and Vite application focused on execution transparency.

Responsibilities include:

- Submitting goals to the backend
- Visualizing the execution DAG
- Displaying live task state transitions
- Providing minimal but precise control surfaces

The frontend assumes no privileged knowledge of execution logic. All state is derived from backend APIs and realtime streams.

Overall,

```bash
Frontend (React + Vite)
        
        ↓ REST / WebSocket
        
Backend API (FastAPI)
        
        ↓ Task orchestration
        
Execution Engine
        
        ↓ State persistence
        
Vector / State Store
```

## Execution Model

1. A user submits a goal via the API.
2. The system decomposes the goal into a graph of dependent tasks.
3. Tasks are scheduled and executed asynchronously.
4. Each task transitions through well-defined states such as pending, running, completed, or failed.
5. State changes are streamed to clients in real time.
6. The full execution graph remains inspectable after completion.

This model ensures that autonomy never comes at the cost of debuggability or control.

## API Overview

#### Base URL
```bash
/
```

Health check endpoint returning service status.

#### Submit a Goal
```bash
POST /api/run
```

#### Request
```json
{
  "goal": "High level objective to execute"
}
```

#### Response
```json
{
  "run_id": "unique-execution-id"
}
```

#### Realtime Updates

```bash
WS /ws
```

Streams execution events including:

- Task creation
- State transitions
- Execution output
- Failure and retry signals

## Frontend

The frontend is a React application built with Vite.

Responsibilities include:

- Goal submission
- Real-time DAG visualization
- Execution history browsing
- Live status updates via WebSockets

The frontend is intentionally decoupled from backend implementation details and communicates exclusively through defined APIs.

## Local Development

### Prerequisites

- Python 3.11
- Node.js 18+
- pip
- npm or pnpm

### Backend

```bash
cd backend/app
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

Backend runs on http://localhost:8000.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173.

## Deployment

AWE is designed to deploy cleanly as two independent services.

### Backend

- Stateless FastAPI service
- Requires environment variables for configuration
- Compatible with Render, Railway, Fly.io, and similar platforms

Key requirements:

- Correct Python runtime version
- Requirements file located at the backend root used by the platform
- Explicit CORS configuration when frontend and backend are on different domains

### Frontend

- Static build output
- Can be deployed to any static hosting provider
- Requires a single environment variable pointing to the backend API base URL

## Configuration

The system is configured entirely through environment variables.

For Example,

```
APP_HOST=0.0.0.0
APP_PORT=8000
```
Additional service integrations can be enabled without modifying core execution logic.

## Design Philosophy

AWE is built around the belief that autonomous systems should be:

- Inspectable by default
- Deterministic where possible
- Observable at every layer
- Architected with clear boundaries

The project favors explicit data flow, explicit state transitions, and explicit interfaces over opaque abstractions.

## Project Structure

```
awe/
├── backend/
│   └── app/
│       ├── api/              # REST endpoints
│       ├── execution/        # Task orchestration logic
│       ├── ws_manager/       # WebSocket handling
│       ├── config.py         # Environment configuration
│       └── main.py           # Application entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.tsx
│   └── vite.config.mjs
│
└── README.md
```

## Engineering Principles

- **Explicit State**  
  Every transition is modeled and persisted.
  
- **Deterministic Execution**  
  Identical inputs produce identical execution graphs.

- **Observability First**  
  Execution is visible at all times, not inferred.

- **Modular Design**  
  Components evolve independently without cascading changes.

- **Production Readiness**  
  Execution state is continuously stored and queryable.

- **Production-Grade API**  
  Clear interfaces, predictable behavior, and deployability are first-class concerns.

## Roadmap

- DAG persistence and replay
- Task retries and compensation logic
- Execution versioning
- Access control and authentication
- Multi-tenant support
- Advanced visualization layers

Intended Use Cases

Demonstrating agentic execution systems

Evaluating autonomous planning and orchestration

Teaching or assessing systems design and execution models

Building internal tooling for structured automation

## License

MIT License.
