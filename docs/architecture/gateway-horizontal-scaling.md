# Gateway Horizontal Scaling Strategy

Gatekeeper is designed so the Gateway Runtime can scale horizontally.

The gateway should be able to run as multiple stateless-ish instances behind a load balancer while sharing distributed runtime coordination through Redis.

---

## Goal

Support this topology:

```text
API Clients
   ↓
Load Balancer
   ↓
Gateway Instance A
Gateway Instance B
Gateway Instance C
   ↓
Upstream Services
```

## Snapshot Scaling Model
```text
Control Plane
   ↓
Gateway A snapshot cache
Gateway B snapshot cache
Gateway C snapshot cache
```

## Rate Limiting Scaling Model
```text
Gateway A \
Gateway B ---> Redis counters
Gateway C /
```