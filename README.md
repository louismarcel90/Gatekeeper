# Gatekeeper — *Zero-Trust API Gateway & Management Platform*


## 1. 🧠 What is Gatekeeper / Why It Exists


Gatekeeper is a full-stack API security and governance platform built to address today’s most urgent enterprise needs: access control, rate limiting, auditability, analytics, and abuse prevention.


This project demonstrates the design of a modern API Gateway, focused on security, performance, and observability, with a fully-featured admin console.


---


## 2. ⚠️ Problems Gatekeeper Solves


- API exposure without consistent governance
- Abuse, bots, and uncontrolled traffic
- Limited visibility into API usage and risk


---


## 3. 🧪 What Gatekeeper Demonstrates


- System design of a Zero-Trust API gateway
- Trade-offs in security, performance, and observability
- End-to-end ownership of a production-style platform


---


## 4. 🧱 Core Capabilities


- Centralized access control at the gateway level
- Deterministic rate limiting and quota enforcement
- Auditable, observable API traffic


---


## 5. 📐 Scale & Constraints


- Shared zero-trust control plane, enforcing access policies across 50–300+ services, cutting policy drift by 70–90% and access-related incidents by ~60%
- Deterministic latency under load, sustaining p95 < 100 ms and p99 stability at 5–10× peak traffic, including during partial service degradation
- Security, isolation, observability as hard guarantees, with 100% audited data access, strong tenant isolation, and <3-minute MTTR via end-to-end telemetry


---


## 6. ⚙️ Key Engineering Features


- Secure API access using API keys and JWT with scoped authorization
- Deterministic traffic control via per-client and per-route rate limiting
- Full operational visibility through audit logs, metrics, and an admin control plane


---


## 7. 🧰 Technologies Used in Practice


<p align="left">
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/typescript/typescript-original.svg" alt="typescript" width="40" height="40" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/docker/docker-original-wordmark.svg" alt="docker" width="40" height="40" />
<img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/redis/redis-original-wordmark.svg" alt="redis" width="40" height="40" />
</p>


---


## 8. 🏛️ Why Gatekeeper Matters


APIs are a company’s primary integration surface and attack vector.


Gatekeeper mirrors how modern platform teams design internal infrastructure for regulated, security-conscious, and fast-growing organizations.
