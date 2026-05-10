# Frontend Failure-Aware Modes

Gatekeeper treats the frontend as a distributed system participant.

The UI must remain understandable when dependencies degrade.

---

## Goals

The frontend should clearly indicate:

- Control Plane reachability
- realtime stream status
- auth/session readiness
- degraded but usable states

---

## Health States

Gatekeeper frontend uses:

- `healthy`
- `degraded`
- `unavailable`

---

## Dependencies Tracked

### Control Plane
The API that provides authoritative state.

If unavailable:
- mutations cannot complete
- data may become stale
- UI displays a system health banner

---

### Realtime Stream
The SSE connection used for domain events.

If degraded:
- UI still works through polling and manual refresh
- realtime updates may be delayed or missed

---

### Auth Session
The local authenticated user/session projection.

If unavailable:
- protected UI should redirect or block access

---

## Degraded Mode Principles

The UI should:

- avoid pretending everything is healthy
- show what dependency is impacted
- remain usable for read-only cached views where possible
- never become the source of truth

---

## Source of Truth

The Control Plane remains authoritative.

The frontend is a projection that may become stale during network or streaming issues.

---

## Key Principle

> A serious frontend does not hide failure. It explains failure.