# Deployment Architecture & Cloud Topology

Gatekeeper is designed to deploy as three separate runtime services:

- Web Admin UI
- Control Plane API
- Gateway Runtime

Each service has a distinct responsibility, scaling profile, and failure model.

---

## Target Topology

```text
Operators
   ↓
Web Admin UI
   ↓
Control Plane API
   ↓
PostgreSQL

API Clients
   ↓
Load Balancer
   ↓
Gateway Runtime Instances
   ↓
Upstream Services

Gateway Runtime
   ↔
Redis
```

---

## Environments

Gatekeeper supports three environment classes:

---

## Development

Purpose:

local iteration
debugging
feature development

Characteristics:

Docker Compose
local PostgreSQL
local Redis
local Next.js
local Fastify services

---

## Staging

Purpose:

pre-production validation
demo environment
release testing

Characteristics:

production-like env vars
managed PostgreSQL
managed Redis
deployed Web / Control Plane / Gateway
seeded demo data

---

## Production

Purpose:

real traffic enforcement

Characteristics:

managed database
managed Redis
secrets manager
TLS everywhere
horizontal Gateway scaling
restricted Control Plane access
centralized logs and metrics

---

## Service Responsibilities

### Web Admin UI

Responsibilities:

operator-facing interface
authentication state projection
realtime event display
operational dashboards

Deployment options:

Vercel
Cloudflare Pages
AWS Amplify
containerized Next.js

### Control Plane API

Responsibilities:

route and policy management
snapshot lifecycle
admin audit
deployments
realtime events

Deployment options:

AWS ECS / Fargate
Render
Fly.io
Railway
Kubernetes

### Gateway Runtime

Responsibilities:

runtime enforcement
rate limiting
quota enforcement
snapshot cache
runtime observability

Deployment options:

AWS ECS / Fargate
Kubernetes
Fly.io
bare container behind load balancer

### Recommended Cloud Option for Portfolio

For a credible portfolio deployment:

```text
Web: Vercel
Control Plane: Render / Fly.io / ECS
Gateway: Render / Fly.io / ECS
PostgreSQL: managed Postgres
Redis: managed Redis
```

## Deployment Flow

```text
merge to main
  ↓
CI checks
  ↓
build artifacts
  ↓
deploy staging
  ↓
run smoke tests
  ↓
manual approval
  ↓
deploy production
  ↓
post-deploy verification
```
