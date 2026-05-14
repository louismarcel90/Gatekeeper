# C4 - Context Diagram

This document describes Gatekeeper at the highest level: what the system is, who interacts with it, and which external systems surround it.

---

## System Under Discussion

**Gatekeeper** is a Zero-Trust API Gateway & Management Platform.

Its purpose is to let operators define API governance rules in a control plane and have those rules enforced at runtime through a gateway.

Gatekeeper exists to answer questions such as:

- who is allowed to call this API?
- under what conditions?
- with which scopes?
- at what rate?
- under which published configuration version?
- who changed that configuration?
- how can we investigate a deny, throttle, or rollback later?

---

## Primary Actors

### 1. Admin Operator

An internal operator with the highest level of privilege.

Typical actions:

- create and manage admin users
- publish snapshots
- activate snapshots
- rollback snapshots
- inspect deployments and audits
- manage routes and policies

### 2. Security Operator

An internal operator focused on governance and policy safety.

Typical actions:

- create routes and policies
- import policy documents
- run candidate simulations
- publish snapshots
- inspect audits and deployments

### 3. Viewer Operator

An internal read-only operator.

Typical actions:

- inspect routes
- inspect policies
- inspect snapshots
- inspect deployment history
- inspect audit logs
- run basic runtime simulation if allowed by the UI/backend model

### 4. API Client

A consumer of protected APIs routed through the gateway runtime.

This could be:

- an internal service
- a partner integration
- a mobile backend
- an external application client

### 5. Upstream Service

A backend service behind the gateway.

Examples:

- search service
- reports service
- users service
- payments service

The gateway does not exist for its own sake; it exists to govern access to upstream services.

---

## External Systems

### 1. PostgreSQL

Primary persistent store used by Gatekeeper.

Stores:

- admin users
- managed routes
- policies
- snapshots
- audit logs
- deployment history

### 2. Redis (Target State)

Not yet the main runtime dependency in the current implementation, but intended for:

- distributed rate limiting
- shared counters
- runtime caching
- quota enforcement across multiple gateway instances

### 3. Browser / Admin Workstation

Environment from which operators access the Web Admin UI.

### 4. Protected API Ecosystem

The collection of APIs and services governed by Gatekeeper.

Gatekeeper acts as the governance and enforcement boundary in front of them.

---

## High-Level Relationships

### Admin / Security / Viewer → Gatekeeper Web Admin UI

Operators use the UI to:

- authenticate
- inspect system state
- manage control plane resources
- run simulations
- investigate operational history

### Web Admin UI → Control Plane API

The UI calls the control plane to:

- read and mutate configuration
- publish and activate snapshots
- run simulations
- query audit and deployment history
- manage admin users

### Control Plane API → PostgreSQL

The control plane persists:

- routes
- policies
- snapshots
- deployments
- audits
- admin user data

### Gateway Runtime → PostgreSQL / Snapshot Source

The gateway enforces the active snapshot and produces runtime decisions.

### API Client → Gateway Runtime

API traffic enters through the gateway, not directly through the control plane.

### Gateway Runtime → Upstream Services

If traffic is allowed, the gateway routes toward upstream protected services.

---

## Context Diagram (Textual)

```text
[Admin Operator] --------\
[Security Operator] ------> [Gatekeeper Web Admin UI] ---> [Control Plane API] ---> [PostgreSQL]
[Viewer Operator] -------/

[API Client] ------------> [Gateway Runtime] -------------------------------> [Upstream Services]
                                  |
                                  v
                             [Published Snapshot]

Future:
[Gateway Runtime] <-------> [Redis]
```
