# Frontend Performance Engineering

Gatekeeper treats frontend performance as an architectural concern.

The admin UI must remain usable as operational datasets grow.

---

## Goals

The frontend should support:

- large route inventories
- large policy inventories
- growing audit logs
- realtime event streams
- long-running operational sessions

---

## Techniques Used

### Memoized selectors

Filtering and sorting are wrapped in `useMemo` so the UI avoids repeated work on every render.

### Pagination

Routes and policies are paginated before rendering.

### Virtualization

Realtime events are rendered through a virtualized list.

This keeps rendering cost bounded even when the event list grows.

### Bounded local state

Realtime events are capped in memory to avoid unbounded client growth.

---

## State Categories

### Server state
Owned by the Control Plane and accessed via React Query.

### Realtime projection state
Owned by the frontend temporarily for operator visibility.

### Local UI state
Filters, selected rows, forms, pagination, and editing state.

---

## Performance Trade-offs

Pagination is simple and predictable.

Virtualization is used where list length may grow quickly.

The UI avoids treating realtime events as authoritative state; events only trigger invalidation and projection updates.

---

## Future Improvements

- virtualized data tables
- server-side pagination
- query param driven filters
- request cancellation
- debounced filters
- audit log infinite scrolling
- web vitals instrumentation

---

## Key Principle

> The frontend should remain operationally useful even when datasets grow beyond demo size.