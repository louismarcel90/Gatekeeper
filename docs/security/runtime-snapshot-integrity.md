# Runtime Snapshot Integrity

Gatekeeper verifies runtime snapshots before loading them into the Gateway Runtime.

---

## Purpose

Integrity verification helps detect:

- corrupted snapshots
- partial writes
- accidental modification
- inconsistent deployment artifacts

---

## Current Mechanism

The Control Plane generates:

```text
SHA-256 hash
```

## Verification Flow

The Control Plane generates:

```text
publish snapshot
  ↓
generate hash
  ↓
write snapshot file
  ↓
gateway loads snapshot
  ↓
gateway recomputes hash
  ↓
compare hashes
  ↓
accept or reject snapshot
```