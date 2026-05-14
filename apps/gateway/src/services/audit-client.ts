import { request } from "undici";
import { env } from "../config/env";
import { Decision, RequestContext } from "../core/types";

export async function sendDecisionAudit(params: {
  context: RequestContext;
  decision: Decision;
}): Promise<void> {
  const url = `${env.CONTROL_PLANE_BASE_URL}/audit/decisions`;

  await request(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      decision_id: params.decision.decision_id,
      decision: params.decision.decision,
      reason_code: params.decision.reason_code,
      route_id: params.decision.route_id ?? null,
      policy_id: params.decision.policy_id ?? null,
      client_id: params.context.client_id ?? null,
      path: params.context.path,
      method: params.context.method,
      ip: params.context.ip,
      matched_rule: params.decision.matched_rule ?? null,
      explanation: params.decision.explanation,
      snapshot_version: params.decision.snapshot_version ?? null,
    }),
  });
}
