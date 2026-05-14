# Deployment Runbook

This runbook describes the recommended deployment flow for Gatekeeper.

---

## Pre-Deploy Checklist

- [ ] typecheck passes
- [ ] lint passes
- [ ] unit tests pass
- [ ] E2E smoke tests pass
- [ ] load smoke test passes
- [ ] env vars verified
- [ ] database reachable
- [ ] Redis reachable
- [ ] secrets are not committed

---

## Deployment Order

Recommended order:

1. PostgreSQL migrations
2. Control Plane
3. Gateway
4. Web Admin UI

---

## Why This Order?

The Gateway depends on Control Plane snapshot availability.

The Web depends on Control Plane availability.

PostgreSQL must be ready before Control Plane starts.

---

## Post-Deploy Verification

### Control Plane

```bash
curl https://control-plane.example.com/health
curl https://control-plane.example.com/control-plane/instance
```
