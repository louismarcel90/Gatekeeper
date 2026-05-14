# C4 - Container Diagram

This document describes the major containers (deployable units / runtime processes) of Gatekeeper and how they interact.

---

## Overview

Gatekeeper is composed of three main runtime containers:

1. **Web Admin UI (Next.js)**
2. **Control Plane API (Fastify)**
3. **Gateway Runtime (Fastify or equivalent runtime layer)**

These containers interact with a shared persistent store:

4. **PostgreSQL**

A future container is expected:

5. **Redis (for distributed runtime coordination)**

---

## Containers

### 1. Web Admin UI

**Technology**

- Next.js
- React
- TypeScript
- TanStack Query
- Zustand

**Responsibilities**

- authentication UI
- role-aware rendering (viewer / security / admin)
- data fetching from control plane
- simulation triggers
- snapshot publish / activate / rollback actions
- audit and deployment investigation
- admin user management

**Characteristics**

- thin UI, logic pushed to backend where appropriate
- handles degraded states and partial failures
- includes basic observability (recent UI events, health indicators)

---

### 2. Control Plane API

**Technology**

- Node.js
- Fastify
- TypeScript
- PostgreSQL

**Responsibilities**

- authentication and RBAC enforcement
- route management
- policy management
- snapshot lifecycle:
  - publish
  - activate
  - rollback
- policy document export/import
- audit log exposure
- deployment history tracking
- admin user management

**Key property**
This is the **source of truth for governance configuration**, but not the runtime enforcement engine.

---

### 3. Gateway Runtime

**Technology**

- Node.js (Fastify or similar)
- HTTP proxying / routing layer

**Responsibilities**

- receive incoming API requests
- extract identity (API key / token / scopes)
- match route definitions
- evaluate policies
- produce decision:
  - allow
  - deny
  - throttle (future)
- forward traffic to upstream services when allowed
- emit audit evidence

**Key property**
The gateway operates on a **published snapshot**, not on live mutable configuration.

---

### 4. PostgreSQL

**Responsibilities**
Stores all persistent data:

- admin users
- managed routes
- policies
- snapshots
- deployment history
- decision audit logs

**Key property**
Acts as the central persistence layer for both:

- control plane operations
- investigation data

---

### 5. Redis (Future)

**Responsibilities (planned)**

- distributed rate limiting
- quota enforcement
- shared counters across gateway instances
- runtime caching

**Key property**
Will enable horizontal scaling of the gateway without losing consistency in rate limits.

---

## Interactions

### UI → Control Plane

- HTTP requests
- authenticated via JWT
- operations:
  - CRUD (routes, policies)
  - publish / activate / rollback snapshots
  - query audit / deployments
  - manage admin users

---

### Control Plane → PostgreSQL

- read/write operations
- transactional operations for:
  - snapshot creation
  - deployment tracking
  - admin user creation

---

### Gateway → Snapshot Source

- loads active snapshot (via DB or future cache layer)
- uses snapshot as immutable runtime configuration

---

### Gateway → Upstream Services

- forwards requests if allowed
- blocks or throttles otherwise

---

### Gateway → Audit Logs

- emits decision records:
  - decision (allow / deny / throttle)
  - reason
  - route_id
  - policy_id
  - request_id

---

### UI → Gateway (Indirect)

- via simulation endpoints or test flows
- not a direct runtime dependency

---

## Container Diagram (Textual)

```text
[Web Admin UI]
        |
        v
[Control Plane API] ------> [PostgreSQL]
        |
        v
   [Snapshots]

[API Client] ---> [Gateway Runtime] ---> [Upstream Services]
                        |
                        v
                  [Audit Logs]

Future:
[Gateway Runtime] <-------> [Redis]
```
