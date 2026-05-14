import { FastifyInstance } from "fastify";
import {
  createDecisionAuditLog,
  getDecisionAuditLog,
  getDecisionAuditLogs,
} from "../application/audit-service";
import { createDecisionAuditLogSchema, decisionAuditQuerySchema } from "../domain/validators";
import { requireAdminAuth } from "../middleware/admin-auth";
import { sendBadRequest, sendInternalError, sendNotFound } from "../shared/http";

export async function registerAuditRoutes(app: FastifyInstance) {
  app.get("/audit/decisions", { preHandler: [requireAdminAuth] }, async (req, reply) => {
    const parsed = decisionAuditQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return sendBadRequest(reply, parsed.error.message);
    }

    const items = await getDecisionAuditLogs(parsed.data);

    return {
      items,
      pagination: {
        limit: parsed.data.limit,
        offset: parsed.data.offset,
      },
      filters: parsed.data,
    };
  });

  app.get(
    "/audit/decisions/:decisionId",
    { preHandler: [requireAdminAuth] },
    async (req, reply) => {
      const params = req.params as { decisionId: string };
      const item = await getDecisionAuditLog(params.decisionId);

      if (!item) {
        return sendNotFound(reply, `Decision audit "${params.decisionId}" was not found.`);
      }

      return item;
    },
  );

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
