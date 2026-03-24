import { checkRateLimit } from "../services/rate-limiter";
import { buildDecision } from "./decision-factory";
import { findManagedRoute } from "./route-matcher";
import { findMissingScopes } from "./scope-utils";
import { Policy, RequestContext, Snapshot } from "./types";

function findPolicyForRoute(snapshot: Snapshot, routeId: string): Policy | undefined {
  return snapshot.policies.find((policy) => policy.route_id === routeId);
}

export async function evaluateWithSnapshot(
  context: RequestContext,
  snapshot: Snapshot | null,
) {
  if (!snapshot) {
    return buildDecision({
      decision: "DENY",
      reason_code: "SNAPSHOT_MISSING",
      explanation: "No active snapshot is loaded in the gateway runtime.",
      matched_rule: "gateway.snapshot.required",
    });
  }

  const route = findManagedRoute(snapshot, context);

  if (!route) {
    return buildDecision({
      decision: "DENY",
      reason_code: "ROUTE_NOT_FOUND",
      explanation: "No managed route matched the incoming request.",
      snapshot_version: snapshot.version,
      matched_rule: "routing.route.match",
    });
  }

  if (!route.enabled) {
    return buildDecision({
      decision: "DENY",
      reason_code: "ROUTE_DISABLED",
      explanation: "The matched route exists but is currently disabled.",
      snapshot_version: snapshot.version,
      route_id: route.id,
      matched_rule: "routing.route.enabled",
    });
  }

  const policy = findPolicyForRoute(snapshot, route.id);

  if (!policy) {
    return buildDecision({
      decision: "DENY",
      reason_code: "POLICY_NOT_FOUND",
      explanation: "The matched route does not have an attached policy.",
      snapshot_version: snapshot.version,
      route_id: route.id,
      matched_rule: "policy.route.attached",
    });
  }

  if (policy.require_api_key && !context.client_id) {
    return buildDecision({
      decision: "DENY",
      reason_code: "API_KEY_MISSING",
      explanation: "This route requires a valid API key.",
      snapshot_version: snapshot.version,
      route_id: route.id,
      policy_id: policy.id,
      matched_rule: "auth.api_key.required",
    });
  }

  const missingScopes = findMissingScopes(policy.required_scopes, context.scopes);

  if (missingScopes.length > 0) {
    return buildDecision({
      decision: "DENY",
      reason_code: "SCOPE_MISSING",
      explanation: `Missing required scopes: ${missingScopes.join(", ")}`,
      snapshot_version: snapshot.version,
      route_id: route.id,
      policy_id: policy.id,
      matched_rule: "auth.scopes.required",
    });
  }

  if (policy.rate_limit_per_minute !== null) {
    const clientId = context.client_id ?? "anonymous";
    const rateLimit = await checkRateLimit({
      routeId: route.id,
      clientId,
      limitPerMinute: policy.rate_limit_per_minute,
    });

    if (!rateLimit.allowed) {
      return buildDecision({
        decision: "THROTTLE",
        reason_code: "RATE_LIMIT_EXCEEDED",
        explanation: "The request exceeded the configured per-minute rate limit.",
        snapshot_version: snapshot.version,
        route_id: route.id,
        policy_id: policy.id,
        matched_rule: "traffic.rate_limit.per_minute",
        rate_limit: {
          limit: rateLimit.limit,
          current: rateLimit.current,
          retry_after_seconds: rateLimit.retry_after_seconds,
        },
      });
    }
  }

  return buildDecision({
    decision: "ALLOW",
    reason_code: "OK",
    explanation: "The request matched an enabled route and satisfied its active policy.",
    snapshot_version: snapshot.version,
    route_id: route.id,
    policy_id: policy.id,
    matched_rule: "decision.allow.default",
  });
}