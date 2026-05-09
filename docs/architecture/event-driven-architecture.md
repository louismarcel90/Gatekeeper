# Event-Driven Internal Architecture

Gatekeeper uses an internal domain event model to make critical control-plane actions observable and extensible.

---

## Purpose

Domain events allow the system to react to important changes without coupling every feature directly to route handlers.

Examples:

- route created
- route updated
- route enabled / disabled
- policy created
- policy updated
- snapshot published
- snapshot activated
- rollback completed

---

## Current Implementation

The current event bus is in-process.

It supports:

- publishing typed domain events
- subscribing handlers
- structured event logging

---

## Event Shape

```json
{
  "id": "uuid",
  "name": "route.updated",
  "payload": {
    "resource_id": "route_search_get",
    "resource_type": "managed_route",
    "action": "update"
  },
  "occurred_at": "2026-05-08T00:00:00.000Z"
}