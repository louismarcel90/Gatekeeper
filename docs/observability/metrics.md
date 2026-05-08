# Metrics Strategy

This document defines how Gatekeeper measures system behavior, performance, and reliability.

---

## Objectives

Metrics are used to:

- understand system health
- detect anomalies
- measure performance under load
- support incident response
- define Service Level Objectives (SLOs)

---

## Metric Categories

### 1. Control Plane Metrics

#### Request Metrics

- `controlplane_requests_total`
- `controlplane_requests_failed_total`
- `controlplane_request_duration_ms`

Purpose:

- monitor API usage
- detect backend instability

---

#### Mutation Metrics

- `controlplane_mutations_total`
- `controlplane_mutations_failed_total`

Examples:

- create route
- update policy
- publish snapshot

---

#### Snapshot Metrics

- `snapshots_created_total`
- `snapshot_activation_total`
- `snapshot_rollback_total`

---

### 2. Gateway Runtime Metrics

#### Traffic Metrics

- `gateway_requests_total`
- `gateway_requests_per_route`
- `gateway_requests_per_client`

---

#### Decision Metrics

- `gateway_decisions_allow_total`
- `gateway_decisions_deny_total`
- `gateway_decisions_throttle_total`

---

#### Latency Metrics

- `gateway_request_latency_ms`
- `gateway_policy_evaluation_latency_ms`

---

#### Error Metrics

- `gateway_errors_total`
- `gateway_upstream_errors_total`

---

### 3. Snapshot Metrics

- `snapshot_current_version`
- `snapshot_refresh_count`
- `snapshot_refresh_failures`

---

## SLO Targets (Initial)

These are target goals, not strict guarantees yet.

- Control plane latency (p95): < 200ms
- Gateway latency (p95): < 100ms
- Gateway error rate: < 1%
- Snapshot refresh failure: < 0.1%

---

## Aggregation Strategy

### Current State

- metrics are conceptual and logged manually or partially

### Future State

- Prometheus integration
- scrape endpoints:
  - `/metrics` on control plane
  - `/metrics` on gateway

---

## Dashboard (Future)

Key dashboards:

1. Gateway Health
2. Decision Distribution (allow / deny / throttle)
3. Snapshot Activity
4. Control Plane Errors
5. Latency Heatmaps

---

## Alerting (Future)

Examples:

- high deny spike
- gateway latency spike
- snapshot refresh failures
- control plane error surge

---

## Key Insight

Metrics answer:

> “Is the system behaving correctly at scale?”


---

## Gateway Runtime Metrics Endpoint

Gatekeeper exposes local runtime metrics at:

```text
GET /runtime/metrics
```

---

## Runtime Dashboard Endpoint

Gatekeeper exposes an operational dashboard endpoint:

```text
GET /runtime/dashboard
``` 