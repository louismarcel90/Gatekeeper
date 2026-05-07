import { checkQuota } from "../services/quota-limiter"; 
import { checkRateLimit } from "../services/rate-limiter";
import {
  Decision,
  RequestContext,
  Snapshot,
  ManagedRoute,
  Policy,
} from "./types";
import {
  recordAllowDecision,
  recordDenyDecision,
  recordRateLimitExceeded,
} from "../observability/runtime-metrics";

function buildDecision(
  input: Omit<Decision, "decision_id" | "timestamp">,
): Decision {
  return {
    decision_id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...input,
  };
}

function findRouteForRequest(
  snapshot: Snapshot,
  context: RequestContext,
): ManagedRoute | null {
  const route = snapshot.routes.find(
    (candidate) =>
      candidate.path === context.path &&
      candidate.method.toUpperCase() === context.method.toUpperCase(),
  );

  return route ?? null;
}

function findPolicyForRoute(
  snapshot: Snapshot,
  routeId: string,
): Policy | null {
  const policy = snapshot.policies.find(
    (candidate) => candidate.route_id === routeId,
  );

  return policy ?? null;
}

export async function evaluateDecision(
  snapshot: Snapshot,
  context: RequestContext,
): Promise<Decision> {
  const route = findRouteForRequest(snapshot, context);

  if (!route) {
    recordDenyDecision();

    return buildDecision({
      decision: "DENY",
      reason_code: "ROUTE_NOT_FOUND",
      explanation: "No enabled managed route matched this request.",
      snapshot_version: snapshot.version,
      matched_rule: "routing.route.match",
    });
  }

  if (!route.enabled) {
    recordDenyDecision();

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
    recordDenyDecision();

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
    recordDenyDecision();

    return buildDecision({
      decision: "DENY",
      reason_code: "API_KEY_MISSING",
      explanation:
        "This route requires a valid API key or authenticated client identity.",
      snapshot_version: snapshot.version,
      route_id: route.id,
      policy_id: policy.id,
      matched_rule: "auth.client_identity.required",
    });
  }

  if (
    policy.required_scopes.length > 0 &&
    context.auth.bearer_present &&
    !context.auth.jwt_valid
  ) {
    recordDenyDecision();

    return buildDecision({
      decision: "DENY",
      reason_code: "JWT_INVALID",
      explanation: `The bearer token is invalid: ${
        context.auth.jwt_invalid_reason ?? "unknown reason"
      }.`,
      snapshot_version: snapshot.version,
      route_id: route.id,
      policy_id: policy.id,
      matched_rule: "auth.jwt.valid",
    });
  }

  if (policy.required_scopes.length > 0 && !context.auth.jwt_valid) {
    recordDenyDecision();

    return buildDecision({
      decision: "DENY",
      reason_code: "JWT_INVALID",
      explanation: "A valid bearer token is required to satisfy scoped access.",
      snapshot_version: snapshot.version,
      route_id: route.id,
      policy_id: policy.id,
      matched_rule: "auth.jwt.required_for_scopes",
    });
  }

  const missingScopes = policy.required_scopes.filter(
    (scope) => !context.scopes.includes(scope),
  );

  if (missingScopes.length > 0) {
    recordDenyDecision();

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
      recordDenyDecision();
      recordRateLimitExceeded();

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

  if (policy.quota_per_day !== null) {
    const clientId = context.client_id ?? "anonymous";

    const quota = await checkQuota({
      routeId: route.id,
      clientId,
      limitPerDay: policy.quota_per_day,
    });

    if (!quota.allowed) {
      recordDenyDecision();

      return buildDecision({
        decision: "THROTTLE",
        reason_code: "QUOTA_EXCEEDED",
        explanation: "The request exceeded the configured daily quota.",
        snapshot_version: snapshot.version,
        route_id: route.id,
        policy_id: policy.id,
        matched_rule: "traffic.quota.per_day",
        quota: {
          limit: quota.limit,
          current: quota.current,
          retry_after_seconds: quota.retry_after_seconds,
        },
      });
    }
  }

  recordAllowDecision();

  return buildDecision({
    decision: "ALLOW",
    reason_code: "OK",
    explanation:
      "The request matched an enabled route and satisfied its active policy.",
    snapshot_version: snapshot.version,
    route_id: route.id,
    policy_id: policy.id,
    matched_rule: "decision.allow.default",
  });
}

export const evaluateWithSnapshot = evaluateDecision;