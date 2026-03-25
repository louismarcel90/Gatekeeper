import { Policy, SimulationInput, Snapshot } from "../domain/types";
import { buildSimulationDecision } from "./decision-factory";
import { findManagedRouteForSimulation } from "./route-matcher";
import { findMissingScopes } from "./scope-utils";

function findPolicyForRoute(snapshot: Snapshot, routeId: string): Policy | undefined {
  return snapshot.policies.find((policy) => policy.route_id === routeId);
}

export function evaluateSimulation(
  input: SimulationInput,
  snapshot: Snapshot | null,
) {
  if (!snapshot) {
    return buildSimulationDecision({
      decision: "DENY",
      reason_code: "SNAPSHOT_MISSING",
      explanation: "No published snapshot is available for simulation.",
      matched_rule: "simulation.snapshot.required",
    });
  }

  const route = findManagedRouteForSimulation(snapshot, input);

  if (!route) {
    return buildSimulationDecision({
      decision: "DENY",
      reason_code: "ROUTE_NOT_FOUND",
      explanation: "No managed route matched the simulated request.",
      snapshot_version: snapshot.version,
      matched_rule: "simulation.routing.route.match",
    });
  }

  if (!route.enabled) {
    return buildSimulationDecision({
      decision: "DENY",
      reason_code: "ROUTE_DISABLED",
      explanation: "The matched route exists but is disabled.",
      snapshot_version: snapshot.version,
      route_id: route.id,
      matched_rule: "simulation.routing.route.enabled",
    });
  }

  const policy = findPolicyForRoute(snapshot, route.id);

  if (!policy) {
    return buildSimulationDecision({
      decision: "DENY",
      reason_code: "POLICY_NOT_FOUND",
      explanation: "The matched route has no attached policy.",
      snapshot_version: snapshot.version,
      route_id: route.id,
      matched_rule: "simulation.policy.route.attached",
    });
  }

  if (policy.require_api_key && !input.client_id) {
    return buildSimulationDecision({
      decision: "DENY",
      reason_code: "API_KEY_MISSING",
      explanation: "The simulated request is missing a required API key.",
      snapshot_version: snapshot.version,
      route_id: route.id,
      policy_id: policy.id,
      matched_rule: "simulation.auth.api_key.required",
    });
  }

  const missingScopes = findMissingScopes(policy.required_scopes, input.scopes);

  if (missingScopes.length > 0) {
    return buildSimulationDecision({
      decision: "DENY",
      reason_code: "SCOPE_MISSING",
      explanation: `The simulated request is missing required scopes: ${missingScopes.join(", ")}`,
      snapshot_version: snapshot.version,
      route_id: route.id,
      policy_id: policy.id,
      matched_rule: "simulation.auth.scopes.required",
    });
  }

  if (policy.rate_limit_per_minute !== null) {
    return buildSimulationDecision({
      decision: "ALLOW",
      reason_code: "OK",
      explanation:
        "The simulated request would pass current auth checks. Rate limiting is configured on this route.",
      snapshot_version: snapshot.version,
      route_id: route.id,
      policy_id: policy.id,
      matched_rule: "simulation.decision.allow.with_rate_limit_configured",
      simulated_rate_limit: {
        configured_limit: policy.rate_limit_per_minute,
      },
      simulated_quota:
        policy.quota_per_day !== null
          ? {
              configured_limit: policy.quota_per_day,
            }
          : undefined,
    });
  }

  if (policy.quota_per_day !== null) {
    return buildSimulationDecision({
      decision: "ALLOW",
      reason_code: "OK",
      explanation:
        "The simulated request would pass current auth checks. A daily quota is configured on this route.",
      snapshot_version: snapshot.version,
      route_id: route.id,
      policy_id: policy.id,
      matched_rule: "simulation.decision.allow.with_quota_configured",
      simulated_quota: {
        configured_limit: policy.quota_per_day,
      },
    });
  }

  return buildSimulationDecision({
    decision: "ALLOW",
    reason_code: "OK",
    explanation:
      "The simulated request matched an enabled route and satisfied its active policy.",
    snapshot_version: snapshot.version,
    route_id: route.id,
    policy_id: policy.id,
    matched_rule: "simulation.decision.allow.default",
  });
}