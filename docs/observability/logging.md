# Logging Strategy

This document defines how Gatekeeper logs system activity.

---

## Objectives

Logging is used to:

- debug issues
- support audit trails
- enable investigations
- provide system transparency

---

## Logging Principles

1. Structured logs (JSON format)
2. Consistent fields across services
3. Correlation with request_id
4. Minimal but meaningful logs

---

## Standard Log Fields

All logs should include:

- `timestamp`
- `request_id`
- `service` (control-plane / gateway)
- `level` (info / warn / error)
- `message`

Optional fields:

- `actor_user_id`
- `actor_email`
- `route_id`
- `policy_id`
- `decision`
- `snapshot_version`

---

## Control Plane Logs

Examples:

```json
{
  "timestamp": "2026-03-28T12:00:00Z",
  "service": "control-plane",
  "request_id": "abc-123",
  "actor_email": "admin@gatekeeper.io",
  "action": "publish_snapshot",
  "snapshot_version": 12
}
```
