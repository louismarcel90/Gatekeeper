# Tracing Strategy

This document explains how Gatekeeper tracks requests and actions across the system.

---

## Objectives

Tracing is used to:

- follow a request across components
- debug failures
- investigate incidents
- correlate actions with outcomes

---

## Core Concept: Request Correlation

Each request is assigned a:

- `request_id`

This ID is:

- generated at entry point
- propagated through all layers
- logged in:
  - control plane logs
  - gateway logs
  - audit logs
  - deployment history

---

## Control Plane Tracing

For each request:

- request_id
- actor_user_id
- actor_email
- endpoint
- operation type
- timestamp

---

## Gateway Tracing

Each incoming API request includes:

- request_id (generated or forwarded)
- client_id
- route_id
- policy_id
- decision (allow / deny / throttle)
- timestamp

---

## Cross-System Trace Example

```text
User clicks "Publish Snapshot"
↓
UI request (request_id = X)
↓
Control Plane logs mutation
↓
Snapshot created (version 12)
↓
Deployment recorded (request_id = X)
↓
Gateway later uses snapshot 12
↓
Incoming API request evaluated
↓
Audit log includes request_id = Y
```
