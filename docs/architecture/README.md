# Architecture Overview

Gatekeeper is a Zero-Trust API Gateway & Management Platform designed to make API governance executable, observable, and deployment-safe.

This architecture separates the system into two major operational planes:

- **Control Plane**: where operators define and manage routes, policies, snapshots, admin users, and investigations
- **Gateway Runtime**: where incoming API traffic is evaluated and enforced against the currently active snapshot

The system is designed so that governance decisions are not just documented, but actually applied to live traffic in a controlled and auditable manner.

---

## Architecture Goals

Gatekeeper is built around the following goals:

1. **Make API governance executable**
   - policies should be enforced, not just described
   - routes and access rules should directly affect runtime behavior

2. **Protect runtime stability**
   - the gateway should continue enforcing the last known good snapshot even if the control plane becomes unavailable

3. **Make changes deployment-safe**
   - policy and route changes should move through publish / activate / rollback flows
   - operators should have a clear history of what changed and when

4. **Support investigation and accountability**
   - sensitive actions should be attributable to an actor
   - requests and decisions should be traceable using request correlation

5. **Keep the frontend operationally aware**
   - the admin UI is treated as a system surface, not just a static dashboard
   - health, degraded mode, recent UI events, and investigation views are first-class behaviors

---

## High-Level Building Blocks

### 1. Web Admin UI

The admin console used by operators to:

- authenticate
- inspect routes and policies
- run simulations
- publish snapshots
- activate and rollback snapshots
- investigate audit history
- inspect deployment history
- manage admin users

### 2. Control Plane API

The authoritative management API responsible for:

- auth and RBAC
- managed routes
- policies
- snapshots
- policy document export/import
- deployment history
- admin user management
- decision audit exploration

### 3. Gateway Runtime

The runtime enforcement layer responsible for:

- receiving API traffic
- resolving the active snapshot
- matching routes
- evaluating policies
- returning allow / deny / throttle decisions
- emitting audit evidence

### 4. PostgreSQL

The main persistent store for:

- admin users
- managed routes
- policies
- snapshots
- decision audit logs
- deployment history

### 5. Future Redis Layer

A future runtime optimization layer intended for:

- distributed rate limiting
- quota coordination
- runtime caching
- lower-latency enforcement in multi-instance gateway deployments

---

## Core Architecture Principles

### Separation of concerns

The control plane owns configuration and governance operations.  
The gateway owns enforcement of already-published configuration.

### Snapshot boundary

The gateway should not depend on live mutable policy editing state.  
It should consume a published snapshot boundary that represents a stable, deployable enforcement view.

### Least privilege

Administrative capabilities are split across roles:

- `viewer`
- `security`
- `admin`

### Audit as a first-class concern

Important actions and runtime decisions must be visible, attributable, and queryable.

### Safe operational rollback

When a configuration causes operational problems, the system must support rollback to a previously known good state.

---

## Documents in this Section

### `c4-context.md`

Explains the system boundary, external actors, and external dependencies.

### `c4-container.md`

Explains the major deployable/runtime containers and how they interact.

### `c4-component.md`

Explains the main internal components inside the control plane, gateway runtime, and frontend.

---

## Current State vs Target State

### Current implemented state

Gatekeeper already supports:

- role-aware admin UI
- control plane endpoints
- route and policy management
- snapshot lifecycle
- policy-as-code import/export
- audit and deployment investigation
- actor and request correlation
- frontend observability basics

### Target advanced state

Gatekeeper is intended to grow toward:

- distributed rate limiting with Redis
- stronger runtime caching
- richer observability and metrics
- stronger failure-mode handling
- multi-instance gateway scaling
- deeper policy engine integration

---

## Read This Next

Recommended order:

1. `c4-context.md`
2. `c4-container.md`
3. `c4-component.md`

### `runtime-consistency-model.md`

Explains how the Gateway Runtime enforces snapshots using eventual runtime consistency and last-known-good behavior.

### `gateway-horizontal-scaling.md`

Explains how Gateway Runtime instances can scale horizontally using local snapshot caches and shared Redis coordination.

### `event-driven-architecture.md`

Explains the internal domain event model used to make critical control-plane actions observable and extensible.

### `realtime-frontend-streaming.md`

Explains how Control Plane domain events are streamed to the frontend using SSE.

### `frontend-failure-aware-modes.md`

Explains how the frontend detects degraded dependencies and keeps the UI understandable under failure.

### `frontend-performance-engineering.md`

Explains memoization, pagination, virtualization, and frontend performance trade-offs.


### End-to-End Tests

Gatekeeper uses Playwright for E2E smoke tests.

```bash
pnpm test:e2e
```