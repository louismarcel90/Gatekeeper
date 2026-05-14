# ADR 002 — Caching and Rate Limiting Strategy

## Status

Accepted (MVP + Planned Evolution)

---

## Context

Gatekeeper must enforce:

- rate limiting (per client, per route)
- quotas (daily / monthly)
- potentially burst protection

These mechanisms must be:

- deterministic
- performant
- scalable across multiple gateway instances

---

## Current State (MVP)

In the current implementation:

- rate limiting is minimal or not fully implemented
- no distributed coordination exists
- gateway operates without shared runtime state

---

## Decision

We choose a **phased approach**:

### Phase 1 (Current)

- no distributed rate limiting
- keep gateway simple and deterministic
- focus on correctness of policy evaluation

### Phase 2 (Planned)

- introduce **Redis** as a distributed runtime layer
- implement:
  - sliding window rate limiting
  - token bucket / leaky bucket strategies
  - quota tracking

---

## Alternatives Considered

### 1. In-memory rate limiting

Pros:

- simple
- fast

Cons:

- not shared across instances
- breaks in horizontal scaling
- inconsistent enforcement

---

### 2. Database-based rate limiting (PostgreSQL)

Pros:

- strong consistency

Cons:

- too slow for high-frequency updates
- high write contention
- poor scalability

---

### 3. External API Gateway (managed solution)

Pros:

- offloads complexity

Cons:

- removes control over governance logic
- not aligned with project goal (building gateway)

---

## Rationale

Redis is chosen because:

- it supports atomic operations (INCR, EXPIRE)
- it is designed for high-throughput workloads
- it enables distributed coordination
- it is widely used for rate limiting patterns

---

## Consequences

### Positive

- scalable rate limiting
- consistent enforcement across gateway instances
- low latency operations

### Negative

- additional infrastructure dependency
- need for failure handling (Redis unavailable)
- eventual consistency trade-offs

---

## Failure Considerations

When Redis is unavailable:

- gateway may:
  - fallback to allow (fail-open)
  - fallback to deny (fail-closed)
- this behavior must be explicitly defined later

---

## Future Work

- implement Redis-based rate limiter
- define quota models
- define fail-open vs fail-closed strategy
- add observability around rate limiting decisions
