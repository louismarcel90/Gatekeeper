# Control Plane Scaling Strategy

Gatekeeper's Control Plane is designed to evolve from a single local service into multiple stateless API instances behind a load balancer.

---

## Goal

Support this topology:

```text
Admin Operators
   ↓
Load Balancer
   ↓
Control Plane Instance A
Control Plane Instance B
Control Plane Instance C
   ↓
PostgreSQL
```
