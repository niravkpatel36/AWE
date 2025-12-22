# AWE Autonomous Workflow Engine

---

## Overview

AWE is an autonomous workflow execution platform that transforms high-level objectives into structured, dependency-aware workflows and executes them with full execution visibility.

The system models planning, orchestration, and execution as first-class concerns. Each phase is explicitly represented, enabling real-time inspection of task dependencies, execution state, and outputs throughout the lifecycle of a workflow.

AWE is designed to serve as a reference implementation for autonomous execution systems, intelligent workflow engines, and orchestration platforms where clarity, correctness, and observability are core design goals.

---

## Key Capabilities

### Goal-Oriented Workflow Planning

AWE accepts a single high-level goal and decomposes it into a set of discrete tasks with clearly defined dependencies. The resulting workflow represents execution intent in a structured and inspectable form.

### Dependency-Aware Task Execution

Tasks are executed according to dependency relationships. Execution ordering is determined by the workflow structure, ensuring tasks run only when all prerequisites have completed.

### Live Execution Visibility

Workflow execution state is streamed in real time to the user interface. Task progress, state transitions, and outputs are visible as execution proceeds.

### Execution Metadata and Observability

Each task provides structured metadata, including execution state, timing information, and output data. This information enables detailed inspection of workflow behavior.

### Real-Time Frontend Synchronization

The frontend remains synchronized with backend execution through event-driven updates. State changes are reflected immediately in the user interface.

---

## System Architecture

### Architectural Overview

The system is composed of clearly defined components, each with a focused responsibility:

- Goal intake and planning
- Workflow representation
- Task execution
- Event streaming
- Frontend visualization

This separation supports maintainability, extensibility, and clarity of execution flow.

---

## Core Components

### Planner

The planner interprets a user-provided goal and produces a structured workflow. This workflow consists of tasks and their dependency relationships.

**Planner Responsibilities**

- Interpret high-level goals
- Decompose goals into executable tasks
- Define task dependencies
- Produce a validated workflow structure

---

### Workflow Representation

Workflows are represented as dependency-aware task graphs. Each task is modeled with explicit metadata.

**Task Attributes**

| Field | Description |
|-----|------------|
| Task ID | Unique identifier |
| Description | Human-readable task summary |
| Dependencies | Upstream task identifiers |
| State | Current execution state |
| Timing | Start and completion timestamps |
| Output | Task result payload |

---

### Execution Engine

The execution engine processes tasks according to workflow structure. Tasks transition through defined lifecycle states as they are scheduled and executed.

**Execution Engine Responsibilities**

- Determine task eligibility based on dependencies
- Execute tasks asynchronously
- Track task lifecycle state
- Emit execution events

---

### Event Streaming Layer

Execution events are streamed to connected clients in real time. Events represent task state changes and execution milestones.

**Event Types**

| Event | Description |
|------|------------|
| WorkflowCreated | Workflow initialization |
| TaskCreated | Task added to workflow |
| TaskStateChanged | Lifecycle state transition |
| TaskCompleted | Successful task completion |
| TaskOutputAvailable | Output ready for consumption |

---

### Frontend Application

The frontend application visualizes workflow execution and task state in real time. It consumes execution events and renders the current workflow state.

**Frontend Capabilities**

- Workflow visualization
- Task-level execution details
- Real-time state updates
- Output inspection

---

## Execution Model

### Task Lifecycle

Tasks progress through a well-defined set of lifecycle states.

| State | Description |
|------|------------|
| Created | Task has been defined |
| Pending | Waiting for dependencies |
| Running | Actively executing |
| Completed | Execution finished successfully |
| Failed | Execution terminated with error |

Lifecycle transitions are deterministic and observable.

---

### Execution Rules

- Tasks are eligible for execution when all dependencies are completed
- Each task executes at most once per workflow
- Execution state is immutable once a task reaches a terminal state

---

## Backend API

### Submit a Goal

**Endpoint**

# API Documentation

## POST /api/goals

**Request Body**

```json
{
  "goal": "Create a portfolio-quality prototype for an AI wellbeing evaluation web app"
}

In progress...
