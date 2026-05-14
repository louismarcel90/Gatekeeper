# ADR 003 — Control Plane vs Gateway Runtime Boundary

## Status

Accepted

---

## Context

Gatekeeper has two fundamentally different responsibilities:

1. **Control Plane**
   - define routes and policies
   - manage snapshots
   - allow operators to change configuration

2. **Gateway Runtime**
   - enforce decisions on live traffic
   - evaluate requests in real time

The key question is:

Should the gateway directly use live configuration from the control plane?

---

## Decision

We introduce a strict boundary using **snapshots**.

The gateway:

- does NOT read live mutable configuration
- only uses a **published snapshot**
- treats snapshots as immutable runtime configuration

---

## Alternatives Considered

### 1. Direct coupling (gateway reads live DB state)

Pros:

- simpler implementation

Cons:

- inconsistent behavior during updates
- partial writes may affect runtime
- harder to reason about state
- no rollback safety

---

### 2. Event-driven live updates

Pros:

- near real-time updates

Cons:

- complex synchronization
- risk of partial state application
- difficult debugging

---

## Rationale

Snapshots provide:

- **consistency** → gateway sees a stable configuration
- **safety** → changes are explicit (publish → activate)
- **rollback capability** → revert to previous version
- **auditability** → each version is traceable

This mirrors production systems where:

- configuration changes are deployed
- not instantly applied without control

---

## Consequences

### Positive

- deterministic runtime behavior
- strong operational safety
- clear separation of responsibilities
- easier debugging and investigation

### Negative

- slight delay between configuration change and enforcement
- need for snapshot lifecycle management
- additional complexity in control plane

---

## Operational Benefits

Snapshots enable:

- controlled rollout
- rollback on incident
- comparison between versions
- safer experimentation

---

## Future Evolution

- snapshot diffing (compare versions)
- partial rollout strategies
- canary deployments (advanced)
- multi-region snapshot propagation

---

## Key Principle

> The gateway must enforce a **known, stable version of truth**, not a mutable and evolving configuration.
