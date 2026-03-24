import { FastifyInstance } from "fastify";
import {
  createDecisionAuditLog,
  getDecisionAuditLogs,
} from "../application/audit-service";
import { createDecisionAuditLogSchema } from "../domain/validators";
import { sendBadRequest, sendInternalError } from "../shared/http";

export async function registerAuditRoutes(app: FastifyInstance) {
  app.get("/audit/decisions", async () => {
    return {
      items: await getDecisionAuditLogs(),
    };
  });

  app.post("/audit/decisions", async (req, reply) => {
    const parsed = createDecisionAuditLogSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendBadRequest(reply, parsed.error.message);
    }

    try {
      const created = await createDecisionAuditLog(parsed.data);
      return reply.code(201).send(created);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while creating audit log.";
      return sendInternalError(reply, message);
    }
  });
}