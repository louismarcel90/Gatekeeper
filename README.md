# Gatekeeper — _Zero-Trust API Gateway & Policy Enforcement Platform_

## 🧰 Technologies Used in Practice

<p align="left">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nextjs/nextjs-original.svg" alt="nextjs" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-original.svg" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nestjs/nestjs-original.svg" alt="nestjs" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/go/go-original.svg" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/kubernetes/kubernetes-plain.svg" width="40" height="40"/>
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/opentelemetry/opentelemetry-original.svg" width="40" height="40"/>
</p>

> Every request is not just validated. It is judged, explained, and proven.

![node](https://img.shields.io/badge/node-%3E%3D18-green)
![license](https://img.shields.io/badge/license-MIT-blue)
![interface](https://img.shields.io/badge/interface-Web%20App-black)
![architecture](https://img.shields.io/badge/architecture-Event--Driven-purple)

---

## 🧠 What is Gatekeeper / Why It Exists

Gatekeeper is a Decision Infrastructure Layer.

Not:

API Gateway ❌
Auth system ❌
WAF ❌

It is:

A system that evaluates, explains, and proves every API decision

---

## ⚡ Real World Scenario

❌ **Problem**

Request:
GET /search?q=financial-report

JWT: valid ✔
User: analyst ✔
Scope: search:read ✔

→ System allows

BUT:

Time: 02:13 AM ❗  
Device: unknown ❗  
Dataset: sensitive ❗

→ This request should NOT exist

✅ **Solution**

Gatekeeper enforces **Zero-Trust at runtime**:

- every request passes through a policy engine
- decisions are deterministic and auditable
- policies are versioned and centrally managed
- access control is enforced, not assumed

---

## 🧩 System Thinking

Request
↓
Context Enrichment
↓
Policy Evaluation
↓
Risk Scoring
↓
Decision
↓
Evidence (Audit)

Decision = f(identity, action, resource, context, policy)

```bash
                REQUEST

        (TECHNICALLLY VALID)
                ↓
        ┌───────────────────┐
        │    GATEKEEPER     │
        │                   │
        │  ❓ SHOULD THIS   │
        │     EXIST ?       │
        └─────────┬─────────┘
                  ↓
         ┌──────────────────┐
         │     DECISION     │
         │                  │
         │  ALLOW / DENY    │
         │  + EXPLANATION   │
         │  + PROOF         │
         └──────────────────┘
```

---

## 🏗 System Architecture

### 🔵 CONTROL PLANE (GOVERNANCE)

- Policy Management
- Rule Authoring
- Versioning
- Compliance
- Configuration

### 🔴 DATA PLANE (RUNTIME)

- Request Interception
- Context Enrichment
- Policy Evaluation
- Decision Execution

### 🔵🔴 FULL ARCHITECTURE

```bash
                    ┌────────────────────┐
                    │     CLIENTS        │
                    └─────────┬──────────┘
                              │
                              ▼
                  ┌──────────────────────┐
                  │   GATEKEEPER EDGE    │
                  │ (Auth / RateLimit)   │
                  └─────────┬────────────┘
                            │
                            ▼
               ┌──────────────────────────┐
               │   DECISION ENGINE        │
               │                          │
               │  - Context               │
               │  - Policy                │
               │  - Risk                  │
               └───────┬──────────────────┘
                       │
       ┌───────────────┼─────────────────────┐
       ▼               ▼                     ▼
┌────────────┐  ┌──────────────┐   ┌──────────────┐
│ POLICY SVC │  │ CONTEXT SVC  │   │ RISK ENGINE  │
└─────┬──────┘  └──────┬───────┘   └──────┬───────┘
      │                │                  │
      ▼                ▼                  ▼
              ┌──────────────────────┐
              │   DECISION OUTPUT     │
              └─────────┬────────────┘
                        │
                        ▼
              ┌──────────────────────┐
              │   AUDIT (IMMUTABLE)  │
              └─────────┬────────────┘
                        │
                        ▼
              ┌──────────────────────┐
              │   TARGET API         │
              └──────────────────────┘
```

---

### System flow:

Client → Gateway → Decision Engine → Policy Snapshot → Decision → Audit Log

---

## 🔬 The Decision Trace (PROOF SYSTEM)

```bash
{
  "decision_id": "dec_9f3a",
  "timestamp": "2026-04-01T02:13:22Z",

  "input": {
    "user": "analyst@corp",
    "action": "search",
    "resource": "financial-report"
  },

  "context": {
    "time": "02:13",
    "location": "unknown_ip",
    "device": "untrusted"
  },

  "evaluation": {
    "policies_checked": 4,
    "matched_policy": "policy_search_read_v3",
    "rules_triggered": [
      "scope_valid",
      "outside_business_hours",
      "untrusted_device"
    ]
  },

  "risk": {
    "score": 0.82,
    "factors": [
      "time_anomaly",
      "device_unknown"
    ]
  },

  "decision": "DENY",

  "reason": "OUT_OF_POLICY_CONTEXT",

  "explainability": "Sensitive data access outside allowed conditions",

  "integrity": {
    "input_hash": "abc123",
    "policy_version": 8,
    "signature": "immutable-proof"
  }
}
```

---

## 🏛️ Project Structure

```bash

gatekeeper/
│
├── apps/
│ ├── control-plane/ # Policy management (API + UI)
│ └── gateway/ # Runtime enforcement (request evaluation)
│
├── services/
│ ├── policy-service/ # Policy lifecycle & versioning
│ ├── snapshot-service/ # Snapshot generation & distribution
│ ├── decision-engine/ # Deterministic evaluation logic
│ └── audit-service/ # Logging & traceability
│
├── packages/
│ ├── db/ # PostgreSQL schema & migrations
│ ├── contracts/ # Shared types (policies, decisions)
│ ├── policy-sdk/ # Policy evaluation helpers
│ └── observability/ # logs, metrics, tracing
│
├── docs/
│ ├── architecture.md
│ ├── adr/ # Architecture Decision Records
│ └── runbooks/ # Operational procedures
│
├── docker/
├── .github/
├── package.json
└── README.md

```

---

## 🔐 Policy Model

- RBAC / ABAC support
- policy versioning
- snapshot-based evaluation
- deterministic decision engine

Policies are:

- versioned
- auditable
- replayable

---

## ⚖️ Trade-offs

- Centralized policy engine  
  → + consistency  
  → − added latency

- Runtime evaluation  
  → + security  
  → − compute overhead

- Strict enforcement (fail closed)  
  → + safety  
  → − potential false denials

---

## ⚠️ Failure Modes

1. Decision Engine Down

→ FAIL CLOSED (default deny)

2. Partial Context

```bash
context = incomplete
risk = elevated
decision = stricter
```

3. Policy Drift

→ solved via versioned snapshots

4. Replay Attack

→ nonce + timestamp

5. Latency Spike

## → circuit breaker + decision cache

## 🧭 Principles

- Deny > Allow when uncertain
- Context is first-class
- Decisions must be explainable
- Systems must be provable
- Logs are not enough → evidence matters

---

## 🚀 Quick Start

### 📦 1. Installation

#### 📋 Prerequisites

Make sure you have installed:

```bash

- Node.js >= 18
- pnpm (recommended) or npm
- Docker + Docker Compose
- Git

```

---

### ⚙️ 2. Clone & Install

```bash

git clone https://github.com/louismarcel90/Gatekeeper.git
cd gatekeeper
pnpm install

```

---

### 🐳 3. Start Infrastructure

Start infra:

```bash

pnpm infra:up

```

👉 Alternative (if scripts not configured):

```bash

docker-compose up -d

```

Check running services:

```bash

pnpm infra:ps

```

Or:

```bash

docker ps

```

---

Run control plane:

```bash

pnpm --filter @gatekeeper/control-plane dev

```

Run gateway:

```bash

pnpm --filter @gatekeeper/gateway dev

```

### 🧬 4. Database Setup

Typical variables:

```bash

CONTROL_PLANE_PORT=3001
CONTROL_PLANE_HOST=0.0.0.0
DATABASE_URL=postgresql://gatekeeper:gatekeeper@localhost:5432/gatekeeper

GATEWAY_PORT=3002
GATEWAY_HOST=0.0.0.0
CONTROL_PLANE_BASE_URL=http://localhost:3001
SNAPSHOT_POLL_INTERVAL_MS=5000

```

🧪 Run Tests

```bash

pnpm format
pnpm format:check

```

```bash

pnpm run lint
pnpm run typecheck
pnpm run test
pnpm run build

```

Note: API tests require infrastructure to be running.

### 🎬 5. Verify System

Gateway:

```bash

http://localhost:3002

```

Control Plane:

```bash

http://localhost:3001

```

---

## 📡 Runtime Reality

t=0ms → request received  
t=2ms → auth validated  
t=6ms → context enriched  
t=11ms → policy evaluated  
t=18ms → risk scored  
t=22ms → decision computed  
t=25ms → audit written

📊 **Performance (simulated)**

```bash
✔ <5ms policy evaluation
✔ <20ms total request overhead
✔ supports high-throughput request streams
```

⚠️ **Constraints**

```bash
- Policy complexity increases latency
- Snapshot size impacts memory usage
- Redis required for low-latency evaluation
```

🧨 **Failure Model**

```bash
- Duplicate, late, or missing policy updates are expected
- Evaluation is deterministic from snapshot state
- All decisions are idempotent
```

🛡️ **Safety**

```bash
- Fail closed (deny by default)
- Redis failure → fallback to safe state
- Processing failure → retry-ready architecture (DLQ-ready)
```

📐 **Guarantees**

```bash
- Deterministic policy evaluation
- Immutable audit logs
- No implicit trust between services
```

✅ **Verification**

Every decision can be:

```bash
REPLAYED
VERIFIED
AUDITED
PROVEN
```

---

## 🔐 **Security**

```bash
- OAuth2 / JWT / mTLS
- RBAC + ABAC
- Policy-as-code
- Multi-tenant isolation
- Encrypted audit logs
```

---

🧨 WHY GATEKEEPER WINS

```bash
API Gateway → routes traffic
Auth → validates identity
WAF → filters requests

Gatekeeper → proves decisions
```

---

## 👨‍💻 Author

Louis-Marcel Bonga
System Design • Distributed Systems • Decision Infrastructure

Building systems that don’t just work —
they justify themselves.

---

## 📄 License

MIT License
