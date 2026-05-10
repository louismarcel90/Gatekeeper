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
```

---

## Frontend Reconciliation Strategy

The frontend treats realtime events as signals, not as the source of truth.

When an event is received:

1. the event id is checked for duplication
2. invalid timestamps are rejected
3. the event is stored locally for operator visibility
4. related React Query caches are invalidated
5. the authoritative state is re-fetched from the Control Plane

This avoids trusting stale or partial event payloads.

---

## Event Ordering

Events are displayed by `occurred_at` descending.

The UI does not assume that SSE delivery order is perfectly ordered.

---

## Duplicate Handling

Processed event ids are tracked in memory.

Duplicate events are rejected and do not trigger cache invalidation.

---

## State Ownership

Authoritative state remains in:

- Control Plane API
- PostgreSQL

Frontend state is only a projection.