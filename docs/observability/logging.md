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

---

## Gateway Runtime Structured Logging

The Gateway Runtime emits structured JSON logs for operational events.

Examples:

- snapshot load success
- snapshot refresh failure
- Redis health check failures
- rate limit exceeded
- quota exceeded
- allow / deny / throttle decisions

### Standard Runtime Fields

- `timestamp`
- `level`
- `service`
- `instance_id`
- `message`
- `route_id`
- `policy_id`
- `client_id`
- `snapshot_version`
- `error_message`

### Example

```json
{
  "timestamp": "2026-05-07T12:00:00.000Z",
  "level": "WARN",
  "service": "gatekeeper-gateway",
  "instance_id": "gateway-local-1",
  "message": "Distributed rate limit exceeded.",
  "client_id": "partner-x",
  "route_id": "route_search_get",
  "limit": 50,
  "current": 51,
  "retry_after_seconds": 60
}
```
