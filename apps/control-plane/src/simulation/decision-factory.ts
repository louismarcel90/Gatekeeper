import { randomUUID } from "crypto";
import {
  SimulationDecision,
  SimulationDecisionReasonCode,
  SimulationDecisionType,
} from "../domain/types";

type BuildSimulationDecisionInput = {
  decision: SimulationDecisionType;
  reason_code: SimulationDecisionReasonCode;
  explanation: string;
  snapshot_version?: number;
  route_id?: string;
  policy_id?: string;
  matched_rule?: string;
  simulated_rate_limit?: {
    configured_limit: number;
  };
  simulated_quota?: {
    configured_limit: number;
  };
};

export function buildSimulationDecision(input: BuildSimulationDecisionInput): SimulationDecision {
  return {
    decision_id: randomUUID(),
    decision: input.decision,
    reason_code: input.reason_code,
    explanation: input.explanation,
    snapshot_version: input.snapshot_version,
    route_id: input.route_id,
    policy_id: input.policy_id,
    matched_rule: input.matched_rule,
    simulated_rate_limit: input.simulated_rate_limit,
    simulated_quota: input.simulated_quota,
    timestamp: new Date().toISOString(),
  };
}
