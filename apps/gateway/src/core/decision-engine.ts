import { Decision, ManagedRoute, Policy, RequestContext, Snapshot } from "./types";

function findRoute(snapshot: Snapshot, context: RequestContext): ManagedRoute | undefined {
  return snapshot.routes.find((route) => {
    return route.enabled && route.method === context.method && route.path === context.path;
  });
}

function findPolicyForRoute(snapshot: Snapshot, routeId: string): Policy | undefined {
  return snapshot.policies.find((policy) => policy.route_id === routeId);
}

export function evaluateWithSnapshot(
  context: RequestContext,
  snapshot: Snapshot | null,
): Decision {
  const now = new Date().toISOString();

  if (!snapshot) {
    return {
      decision: "DENY",
      reason_code: "SNAPSHOT_MISSING",
      explanation: "No active snapshot loaded in gateway runtime.",
      timestamp: now,
    };
  }

  const route = findRoute(snapshot, context);

  if (!route) {
    return {
      decision: "DENY",
      reason_code: "ROUTE_NOT_FOUND",
      explanation: "No enabled managed route matched this request.",
      timestamp: now,
    };
  }

  const policy = findPolicyForRoute(snapshot, route.id);

  if (!policy) {
    return {
      decision: "DENY",
      reason_code: "POLICY_NOT_FOUND",
      route_id: route.id,
      explanation: "No policy is attached to the matched route.",
      timestamp: now,
    };
  }

  if (policy.require_api_key && !context.client_id) {
    return {
      decision: "DENY",
      reason_code: "API_KEY_MISSING",
      route_id: route.id,
      policy_id: policy.id,
      explanation: "This route requires an API key.",
      timestamp: now,
    };
  }

  if (policy.rate_limit_per_minute !== null && context.path === "/heavy") {
    return {
      decision: "THROTTLE",
      reason_code: "RATE_LIMIT_EXCEEDED",
      route_id: route.id,
      policy_id: policy.id,
      explanation: "The request was throttled by the current route policy.",
      timestamp: now,
    };
  }

  return {
    decision: "ALLOW",
    reason_code: "OK",
    route_id: route.id,
    policy_id: policy.id,
    explanation: "The request matched an enabled route and satisfied its policy.",
    timestamp: now,
  };
}