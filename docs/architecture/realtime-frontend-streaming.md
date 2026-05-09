# Real-Time Frontend Streaming

Gatekeeper uses Server-Sent Events (SSE) to stream Control Plane domain events to the frontend.

---

## Purpose

The frontend can react to critical system changes without manual refresh.

Examples:

- route created
- route updated
- route lifecycle changed
- policy created
- policy updated
- snapshot published
- snapshot activated
- rollback completed

---

## Current Transport

The current implementation uses:

```text
Server-Sent Events
GET /events/stream