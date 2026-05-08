# Notification System

Gatekeeper includes a frontend notification system for operational feedback.

---

## Purpose

The notification system informs operators when important control-plane actions succeed or fail.

Examples:

- route created
- route updated
- route enabled / disabled
- policy created
- policy updated
- snapshot published
- snapshot activated
- rollback completed
- operation failed

---

## Design

Notifications are local frontend events.

They are not a durable audit log.

Durable accountability remains in:

- deployment history
- audit logs
- backend structured logs

---

## Notification Types

- success
- info
- warning
- error

---

## Key Principle

> Notifications help the operator act quickly, but they do not replace auditability.