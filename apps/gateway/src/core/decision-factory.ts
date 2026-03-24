import { randomUUID } from "crypto";
import { Decision, DecisionReasonCode, DecisionType } from "./types";

type BuildDecisionInput = {
  decision: DecisionType;
  reason_code: DecisionReasonCode;
  explanation: string;
  snapshot_version?: number;
  route_id?: string;
  policy_id?: string;
  matched_rule?: string;
};

export function buildDecision(input: BuildDecisionInput): Decision {
  return {
    decision_id: randomUUID(),
    decision: input.decision,
    reason_code: input.reason_code,
    explanation: input.explanation,
    snapshot_version: input.snapshot_version,
    route_id: input.route_id,
    policy_id: input.policy_id,
    matched_rule: input.matched_rule,
    timestamp: new Date().toISOString(),
  };
}