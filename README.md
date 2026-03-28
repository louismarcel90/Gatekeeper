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

> Enforcing trust at runtime. Not assumed. Not implicit.

![node](https://img.shields.io/badge/node-%3E%3D18-green)
![license](https://img.shields.io/badge/license-MIT-blue)
![interface](https://img.shields.io/badge/interface-Web%20App-black)
![architecture](https://img.shields.io/badge/architecture-Event--Driven-purple)

---

## 🧠 What is Gatekeeper / Why It Exists

Modern systems are not secure by design. They are:

- implicitly trusted
- inconsistently protected
- impossible to audit in real-time

Gatekeeper ensures:

- every request is evaluated
- every decision is traceable
- no access is implicitly trusted

---

---

 ## ⚡ Real World Scenario

❌ **Problem**

APIs are the weakest link in modern systems.

- services trust each other implicitly
- authorization logic is scattered
- no unified control layer exists
- auditability is incomplete

---

  ✅ **Solution**

Gatekeeper enforces **Zero-Trust at runtime**:

- every request passes through a policy engine
- decisions are deterministic and auditable
- policies are versioned and centrally managed
- access control is enforced, not assumed

---

## 🧩 System Thinking

Gatekeeper is not a proxy.

It is a **decision system** where:

- access is evaluated per request
- policies define behavior, not code
- state is derived from policy snapshots
- trust is continuously verified

No request is trusted by default.

---

## 🏗 System Architecture

```bash

    [ Client Request ]
            |
            ▼
    +------------------+
    |     Gateway      |
    |  Policy Engine   |
    +------------------+
            |
            ▼
    +------------------+
    |  Control Plane   |
    | Policy Management|
    +------------------+
            |
            ▼
    +------------------+
    |  Data Layer      |
    | - PostgreSQL     |
    | - Redis (cache)  |
    | - Audit Logs     |
    +------------------+

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

- Missing policy snapshot → request denied
- Invalid policy → fallback to safe state
- Partial system failure → deny by default

The system assumes failure.

It is designed to fail safely.

---

## 🧭 Principles

- Trust is never implicit
- Policies define behavior, not code
- Systems must be explainable
- Security must be auditable
- Failure must be safe

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

pnpm control-plane:dev

```
Run gateway:

```bash

pnpm gateway:dev

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

This system is designed for real-world constraints.

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

```bash
- Policy evaluation tests
- Snapshot integrity validation
- Decision replay from audit logs
```

---

## 🔐 **Security**

```bash
- every request is evaluated against active policies
- no implicit trust between services
- decisions are logged and auditable
- enforcement occurs at runtime (not at build-time)

Security is not assumed. It is enforced.
```

---

## 👨‍💻 Author

Built with precision, systems thinking, and a performance-first mindset.

---

## 📄 License

MIT License