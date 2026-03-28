# Decision Model

Every request processed by Gatekeeper produces a Decision.

## Decision Types

- ALLOW
- DENY
- THROTTLE

## Decision Structure

{
"decision": "DENY",
"reason_code": "SCOPE_MISSING",
"policy_id": "policy_123",
"rule_id": "rule_abc",
"explanation": "Required scope users:read:full not present",
"timestamp": "ISO8601"
}

## Determinism Rule

Given the same:

- request
- identity
- policy snapshot

The decision must be identical.

## Reason Codes (initial)

- AUTH_MISSING
- API_KEY_INVALID
- JWT_INVALID
- SCOPE_MISSING
- RATE_LIMIT_EXCEEDED
- QUOTA_EXCEEDED
- TENANT_MISMATCH
