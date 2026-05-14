# Load Testing & Runtime Benchmarking

Gatekeeper uses k6 scripts to validate Gateway Runtime behavior under load.

---

## Purpose

Load testing helps answer:

- does the gateway respond under traffic?
- what is p95 latency?
- does rate limiting trigger predictably?
- does runtime dashboard stay available?
- do ALLOW / DENY / THROTTLE counters increase?

---

## Prerequisites

Start the stack:

```bash
docker compose up -d
pnpm dev:control-plane
pnpm --filter @gatekeeper/gateway dev
pnpm dev:web
```

---

## Démarrer le projet

### Terminal 1 :

```bat
docker compose up -d
```

### Terminal 2 :

```bat
pnpm dev:control-plane
```

### Terminal 3 :

```bat
pnpm --filter @gatekeeper/gateway dev
```

### Get the token

```bat
curl -X POST http://localhost:3001/auth/login ^
-H "Content-Type: application/json" ^
-d "{\"email\":\"admin@gatekeeper.local\",\"password\":\"admin123456\"}"
```

Then

```bat
set GATEWAY_TOKEN=TON_TOKEN
```

---

### Launch smoke test

```bat
pnpm load:gateway:smoke
```

### Launch dashboard test

```bat
pnpm load:gateway:dashboard
```

### Launch rate limit test

```bat
pnpm load:gateway:rate-limit
```

### verify metrics after test

```bat
curl http://localhost:3002/runtime/metrics
```
