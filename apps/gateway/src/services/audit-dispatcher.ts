import { FastifyBaseLogger } from "fastify";
import { Decision, RequestContext } from "../core/types";
import { sendDecisionAudit } from "./audit-client";

export function dispatchDecisionAudit(
  logger: FastifyBaseLogger,
  params: {
    context: RequestContext;
    decision: Decision;
  },
): void {
  void sendDecisionAudit(params).catch((error) => {
    logger.error(
      {
        error,
        decision_id: params.decision.decision_id,
      },
      "Failed to dispatch decision audit",
    );
  });
}