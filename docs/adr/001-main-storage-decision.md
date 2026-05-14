# ADR 001 — Main Storage Decision

## Status

Accepted

---

## Context

Gatekeeper requires a persistent storage system to support:

- admin users and roles
- managed routes
- policies
- snapshots (versioned)
- deployment history
- decision audit logs

The storage must support:

- strong consistency for governance operations
- transactional writes (especially for snapshot publish/activate)
- historical tracking and auditability
- simple querying for investigation workflows

---

## Decision

We choose **PostgreSQL** as the main storage system.

---

## Alternatives Considered

### 1. MongoDB

Pros:

- flexible schema
- easy JSON storage

Cons:

- weaker guarantees for complex transactional workflows
- harder to model relational integrity (routes ↔ policies ↔ snapshots)
- less ideal for audit trails with strict consistency

---

### 2. MySQL

Pros:

- similar relational capabilities
- widely used

Cons:

- slightly less expressive for JSON and advanced querying compared to PostgreSQL
- fewer built-in features useful for evolving schema and audit use cases

---

### 3. Polyglot storage (multiple databases)

Example:

- PostgreSQL for core data
- Redis for runtime
- Elastic for search

Cons:

- too complex for MVP
- introduces operational overhead early
- increases cognitive load without immediate benefit

---

## Rationale

PostgreSQL provides:

- strong transactional guarantees
- relational modeling for routes, policies, snapshots
- good support for JSON fields (policy documents)
- mature ecosystem
- simplicity for initial implementation

It allows us to:

- keep all governance data consistent
- support snapshot versioning safely
- query audit logs reliably
- avoid premature complexity

---

## Consequences

### Positive

- strong data consistency
- simple architecture
- reliable audit and history tracking
- easy local development

### Negative

- not optimized for high-throughput runtime access
- not ideal for distributed rate limiting
- potential scaling limitations if used directly by gateway at scale

---

## Future Evolution

We plan to introduce:

- **Redis** for:
  - rate limiting
  - caching
  - distributed counters

- potential read replicas for scaling read-heavy operations

PostgreSQL will remain the **source of truth**, while runtime optimization layers will be added on top.
