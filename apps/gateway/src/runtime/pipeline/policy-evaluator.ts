import { getActiveSnapshot } from "../runtime-snapshot-store";
import {
  RuntimeEvaluationResult,
  RuntimeIdentity,
  RuntimeRoute,
} from "../runtime-types";

export function evaluatePolicy(
  route: RuntimeRoute,
  identity: RuntimeIdentity,
): RuntimeEvaluationResult {
  const snapshot = getActiveSnapshot();

  const policy = snapshot.policies.find(
    (candidate) => candidate.routeId === route.routeId,
  );

  if (!policy) {
    return {
      decision: "DENY",
      reasonCode: "POLICY_NOT_FOUND",
      explanation: "No policy found for route.",
      routeId: route.routeId,
    };
  }

  const missingScopes = policy.requiredScopes.filter(
    (scope) => !identity.scopes.includes(scope),
  );

  if (missingScopes.length > 0) {
    return {
      decision: "DENY",
      reasonCode: "SCOPE_MISSING",
      explanation: `Missing required scopes: ${missingScopes.join(", ")}`,
      routeId: route.routeId,
      policyId: policy.policyId,
    };
  }

  return {
    decision: "ALLOW",
    reasonCode: "POLICY_PASSED",
    explanation: "Policy evaluation successful.",
    routeId: route.routeId,
    policyId: policy.policyId,
  };
}