# Runtime Consistency Model

Gatekeeper separates configuration writes from runtime enforcement using a snapshot-based consistency model.

---

## Core Principle

The Gateway Runtime does not enforce live mutable configuration.

It enforces the latest successfully loaded active snapshot.

```text
Control Plane mutable state
        ↓ publish
Immutable Snapshot
        ↓ load
Gateway Runtime Cache
        ↓ enforce
API Traffic Decisions