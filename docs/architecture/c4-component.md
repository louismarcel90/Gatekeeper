# C4 - Component Diagram

This document describes the main internal components inside each container of Gatekeeper.

---

## Control Plane Components

### 1. Auth Module

Responsibilities:

- login endpoint
- JWT issuance
- request authentication middleware
- extraction of actor (user id, email, role)

---

### 2. Admin Users Module

Responsibilities:

- list admin users
- create admin users
- role assignment (viewer / security / admin)

---

### 3. Routes Module

Responsibilities:

- manage API routes
- define:
  - path
  - method
  - upstream target
  - enabled flag

---

### 4. Policies Module

Responsibilities:

- attach policies to routes
- define:
  - required scopes
  - API key requirement
  - rate limit (future)
  - quota (future)

---

### 5. Snapshots Module

Responsibilities:

- create snapshot (publish)
- activate snapshot
- rollback snapshot
- manage snapshot versions

---

### 6. Policy Documents Module

Responsibilities:

- export policies as code
- import candidate policy documents
- validate structure before applying

---

### 7. Simulation Module

Responsibilities:

- simulate runtime decisions
- evaluate candidate policy documents
- return decision + explanation

---

### 8. Audit Module

Responsibilities:

- expose decision logs
- filter by:
  - route
  - actor
  - request_id
  - decision type

---

### 9. Deployments Module

Responsibilities:

- track snapshot activation
- track rollback events
- store:
  - actor
  - request_id
  - snapshot version
  - timestamp

---

## Gateway Runtime Components

### 1. Request Parser

Responsibilities:

- parse incoming HTTP request
- extract:
  - method
  - path
  - headers
  - API key / token

---

### 2. Identity Resolver

Responsibilities:

- extract client identity
- resolve:
  - API key presence
  - scopes
  - client identifier

---

### 3. Route Matcher

Responsibilities:

- match request to managed route
- determine route_id

---

### 4. Policy Evaluator

Responsibilities:

- apply policies to request
- check:
  - scopes
  - API key requirement
  - rate limit (future)
  - quota (future)

---

### 5. Decision Engine

Responsibilities:

- produce final decision:
  - allow
  - deny
  - throttle (future)
- attach reason code

---

### 6. Upstream Forwarder

Responsibilities:

- forward allowed requests to upstream services
- block denied requests

---

### 7. Audit Emitter

Responsibilities:

- emit decision logs
- include:
  - request_id
  - route_id
  - policy_id
  - decision
  - timestamp

---

### 8. Snapshot Loader

Responsibilities:

- load active snapshot
- refresh snapshot periodically
- ensure consistency of runtime config

---

## Frontend Components

### 1. Auth Store

- manages user session
- stores role and token

---

### 2. Data Fetch Layer

- React Query hooks
- handles:
  - caching
  - refetching
  - loading states

---

### 3. Role Capability Layer

- maps roles to UI capabilities
- hides or disables actions based on role

---

### 4. Pages (System Views)

- Dashboard
- Routes
- Policies
- Simulation
- Snapshots
- Audit
- Deployments
- Policy Documents
- Admin Users

---

### 5. Observability UI

- health indicators
- degraded mode banners
- recent UI events

---

### 6. Data Explorer Components

- tables
- filters
- pagination
- detail panels

---

## Component Interaction (Textual)

```text
[Request]
   ↓
[Request Parser]
   ↓
[Identity Resolver]
   ↓
[Route Matcher]
   ↓
[Policy Evaluator]
   ↓
[Decision Engine]
   ↓
[Upstream Forwarder] OR [Reject]
   ↓
[Audit Emitter]
```
