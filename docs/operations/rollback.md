# Rollback Strategy

This document describes how Gatekeeper performs safe rollback of configuration.

---

## Objective

Rollback ensures that:

- faulty configurations can be reverted quickly
- system stability is restored
- changes remain auditable

---

## What is Rolled Back

Rollback operates on:

- **snapshots**

Each snapshot represents a full configuration:

- routes
- policies
- bindings

---

## Who Can Rollback

Roles allowed:

- `admin` → full rollback capability
- `security` → optional (depending on policy)
- `viewer` → no rollback

---

## Rollback Flow

1. Operator identifies issue
2. Navigate to Deployments page
3. Select previous snapshot
4. Trigger rollback action
5. New deployment record is created
6. Gateway switches to selected snapshot

---

## Backend Flow

```text
POST /snapshots/:id/rollback

→ validate permissions
→ fetch target snapshot
→ mark as active
→ create deployment_history record
→ emit audit event
```
