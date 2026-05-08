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

---

## Snapshot Diff Before Rollback

Before triggering rollback, operators should compare the current active snapshot with the target rollback snapshot.

Recommended flow:

```text
open Snapshot Diff
  ↓
compare current active version with target rollback version
  ↓
review route and policy changes
  ↓
rollback only after confirming expected differences
```

---

## Route Enable / Disable Safety

Route lifecycle changes are controlled actions.

Disabling a route does not immediately guarantee runtime behavior changes until the configuration is published into a snapshot and activated.

Recommended flow:

```text
disable / enable route
  ↓
review route state
  ↓
publish snapshot
  ↓
compare snapshot diff
  ↓
activate snapshot
  ↓
verify gateway decisions