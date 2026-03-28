# Golden Demo Scenario

1. Create API /search
2. Create client "Partner X"
3. Apply:
   - Rate limit: 50 rps
   - Scope: search:read

## Scenario 1 — Abuse

→ 2000 rps → THROTTLE

## Scenario 2 — Unauthorized

→ Missing scope → DENY

## Scenario 3 — Simulation

→ Test new policy before deployment

## Scenario 4 — Incident Investigation

→ Query logs → reconstruct timeline

## Scenario 5 — Rollback

→ Restore previous configuration
