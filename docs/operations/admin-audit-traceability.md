# Admin Audit Traceability

Gatekeeper records durable audit events for critical Control Plane actions.

---

## Purpose

Admin audit events help answer:

- who changed configuration?
- what resource changed?
- when did it happen?
- which request triggered the change?
- what domain event was emitted?

---

## Current Audit Events

- route.created
- route.updated
- route.lifecycle_changed
- policy.created
- policy.updated
- snapshot.published
- snapshot.activated
- snapshot.rollback_completed
- admin_user.created

---

## Audit Fields

Each event includes:

- action
- resource type
- resource id
- actor user id
- actor email
- request id
- metadata
- created at

---

## Difference From Decision Audit

Decision audit tracks runtime gateway decisions.

Admin audit tracks human/control-plane actions.

Both are necessary.

---

## Key Principle

> Every critical control-plane action should be attributable, searchable, and explainable.