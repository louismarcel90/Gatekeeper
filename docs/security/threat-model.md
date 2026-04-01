# Threat Model

This document defines the security model of Gatekeeper, including critical assets, potential threats, and mitigation strategies.

---

## Objective

Gatekeeper is a **security-critical system**.

It must ensure:

- correct access control enforcement
- integrity of governance configuration
- traceability of decisions
- protection against misuse (internal and external)

---

## Critical Assets

### 1. Admin Accounts

- identities with access to the control plane
- roles: viewer, security, admin

Risk:

- privilege abuse
- unauthorized access

---

### 2. Policies

- define access rules
- determine allow / deny behavior

Risk:

- overly permissive policies
- accidental misconfiguration
- malicious modification

---

### 3. Snapshots

- versioned configuration deployed to gateway

Risk:

- activating a bad snapshot
- tampering with snapshot content
- unauthorized rollback

---

### 4. Gateway Decisions

- runtime enforcement of access

Risk:

- incorrect evaluation
- bypass of policy checks

---

### 5. Audit Logs

- record of actions and decisions

Risk:

- deletion or tampering
- missing logs
- inability to investigate incidents

---

## Threat Categories

---

### 1. Unauthorized Access to Control Plane

#### Threat

An attacker gains access to admin endpoints.

#### Impact

- policy changes
- snapshot activation
- rollback abuse

#### Mitigations

- JWT authentication
- role-based access control (RBAC)
- secure credential handling (future improvement)

---

### 2. Privilege Escalation

#### Threat

A user gains higher privileges than intended.

#### Impact

- unauthorized control over system

#### Mitigations

- strict role enforcement
- separation of roles:
  - viewer (read-only)
  - security (policy control)
  - admin (full control)

---

### 3. Policy Misconfiguration

#### Threat

A policy incorrectly allows or denies access.

#### Impact

- data exposure
- service disruption

#### Mitigations

- simulation before publish
- snapshot-based deployment
- rollback capability

---

### 4. Snapshot Abuse

#### Threat

A malicious or incorrect snapshot is activated.

#### Impact

- widespread incorrect enforcement

#### Mitigations

- explicit publish → activate workflow
- deployment history tracking
- rollback support

---

### 5. Gateway Bypass

#### Threat

Clients bypass the gateway and access upstream services directly.

#### Impact

- loss of enforcement
- security breach

#### Mitigations (conceptual / infra-level)

- restrict upstream services to internal network
- require gateway as single entry point

---

### 6. Audit Tampering

#### Threat

Audit logs are altered or deleted.

#### Impact

- inability to investigate incidents
- compliance issues

#### Mitigations

- append-only audit model (logical)
- request_id correlation
- actor attribution

---

### 7. Denial of Service (DoS)

#### Threat

Excessive traffic overwhelms gateway.

#### Impact

- degraded performance
- system unavailability

#### Mitigations (current + future)

- basic handling today
- Redis-based rate limiting (planned)
- throttling strategies

---

### 8. Sensitive Data Exposure

#### Threat

Logs or responses expose sensitive information.

#### Impact

- data leakage

#### Mitigations

- avoid logging secrets
- structured logging discipline
- redact tokens and credentials

---

## Trust Boundaries

### Boundary 1: Browser → Control Plane

- untrusted input from users
- must validate authentication and permissions

---

### Boundary 2: Control Plane → Database

- trusted backend operations
- must ensure data integrity

---

### Boundary 3: API Client → Gateway

- untrusted external traffic
- must validate identity and policy

---

### Boundary 4: Gateway → Upstream Services

- trusted internal communication
- must ensure only allowed traffic passes

---

## Security Model Summary

Gatekeeper enforces:

- **Zero Trust principle**
  → no request is trusted by default

- **Least privilege**
  → minimal required access

- **Separation of concerns**
  → control plane vs runtime

- **Auditability**
  → every action is traceable

- **Safe deployment**
  → snapshot-based lifecycle

---

## Known Gaps / Future Improvements

- stronger authentication (OAuth / SSO)
- mTLS between services
- immutable audit storage (external sink)
- tenant isolation (multi-tenant support)
- secrets management (Vault / KMS)
- rate limiting enforcement (Redis)

---

## Key Principle

> Security is not a feature — it is the foundation of Gatekeeper.
