# End-to-End Testing

Gatekeeper uses Playwright for browser-level and system-level smoke tests.

---

## Purpose

E2E tests verify that the main user-facing flows work across:

- Web UI
- Control Plane
- Gateway Runtime
- Realtime event stream

---

## Test Coverage

Current E2E coverage includes:

- Control Plane health
- Gateway dashboard health
- admin login
- main navigation
- Routes page smoke test
- Policies page smoke test
- realtime event smoke test

---

## Running Locally

Start required services first:

```bash
docker compose up -d
pnpm dev:control-plane
pnpm --filter @gatekeeper/gateway dev
pnpm dev:web
```