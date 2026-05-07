import { getActiveSnapshot } from "../runtime-snapshot-store";
import { evaluateDistributedRateLimit } from "./distributed-rate-limiter";
import {
  RuntimeEvaluationResult,
  RuntimeIdentity,
  RuntimeRoute,
} from "../runtime-types";

import {
  recordAllowDecision,
  recordDenyDecision,
  recordRateLimitExceeded,
} from "../../observability/runtime-metrics";

export async function evaluatePolicy(
  route: RuntimeRoute,
  identity: RuntimeIdentity,
): Promise<RuntimeEvaluationResult> {
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

  const rateLimitResult =
    await evaluateDistributedRateLimit({
      clientId: identity.clientId,
      routeId: route.routeId,
      limitPerMinute: policy.rateLimitPerMinute,
    });

  if (!rateLimitResult.allowed) {
  recordDenyDecision();
  recordRateLimitExceeded();
  recordAllowDecision();

  return {
      decision: "DENY",
      reasonCode: "RATE_LIMIT_EXCEEDED",
      explanation:
        "Distributed rate limit exceeded.",
      routeId: route.routeId,
      policyId: policy.policyId,
    };
  }

  const missingScopes = policy.requiredScopes.filter(
    (scope) => !identity.scopes.includes(scope),
  );

  if (missingScopes.length > 0) {
      recordDenyDecision();
    return {
      decision: "DENY",
      reasonCode: "SCOPE_MISSING",
      explanation:
        `Missing required scopes: ${missingScopes.join(", ")}`,
      routeId: route.routeId,
      policyId: policy.policyId,
    };
  }

  recordAllowDecision();
  return {
    decision: "ALLOW",
    reasonCode: "POLICY_PASSED",
    explanation: "Policy evaluation successful.",
    routeId: route.routeId,
    policyId: policy.policyId,
  };
}