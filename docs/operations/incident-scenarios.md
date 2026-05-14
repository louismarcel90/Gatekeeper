# Incident Scenarios

This document describes realistic failure scenarios in Gatekeeper and how operators should respond.

---

## Objective

To ensure that:

- incidents are detectable
- impact is understood quickly
- response actions are clear
- recovery is controlled and auditable

---

## Scenario 1 — Bad Policy Deployment

### Description

A new snapshot is published and activated, but it introduces overly restrictive policies.

Symptoms:

- spike in DENY decisions
- critical API endpoints become inaccessible

---

### Detection

- dashboard shows spike in `gateway_decisions_deny_total`
- alerts triggered on deny rate
- operators report issues

---

### Impact

- production traffic partially or fully blocked
- business functionality degraded

---

### Response

1. Identify snapshot version currently active
2. Compare with previous snapshot
3. Trigger rollback

---

### Recovery

- previous snapshot is restored
- traffic returns to normal

---

### Postmortem

- identify faulty policy
- improve simulation before publish
- add validation rules

---

## Scenario 2 — Control Plane Down

### Description

Control Plane API becomes unavailable.

---

### Detection

- API requests fail
- UI cannot perform mutations

---

### Impact

- no new configuration changes possible
- existing gateway behavior continues

---

### Response

- verify gateway is still operating
- check infrastructure logs

---

### Recovery

- restore control plane service
- verify DB connectivity

---

### Key Insight

Gateway must continue enforcing the last active snapshot.

---

## Scenario 3 — Snapshot Corruption

### Description

A snapshot becomes invalid or inconsistent.

---

### Detection

- gateway fails to load snapshot
- increased errors in logs

---

### Impact

- gateway may:
  - fail to enforce
  - fallback to previous state

---

### Response

- detect invalid snapshot version
- rollback to last valid snapshot

---

### Recovery

- ensure snapshot integrity checks
- prevent activation of invalid snapshot

---

## Scenario 4 — Gateway Latency Spike

### Description

Gateway response time increases significantly.

---

### Detection

- latency metrics increase (p95 > threshold)
- user complaints

---

### Impact

- degraded user experience
- potential timeouts

---

### Response

- inspect logs
- check:
  - DB latency
  - CPU usage
  - policy complexity

---

### Recovery

- optimize evaluation
- introduce caching layer (future Redis)

---

## Scenario 5 — Audit Logs Missing

### Description

Audit logs are not being recorded.

---

### Detection

- empty audit dashboard
- logs missing in DB

---

### Impact

- loss of traceability
- compliance risk

---

### Response

- inspect audit emitter
- check DB writes

---

### Recovery

- restore logging pipeline
- backfill if possible

---

## Key Principle

Every incident must answer:

- what happened?
- when?
- who triggered it?
- which snapshot was involved?
- how do we recover safely?
