import { FastifyInstance } from "fastify";
import { getAdminAuditEvents } from "../application/admin-audit-service";
import { requireAdminAuth } from "../middleware/admin-auth";

export async function registerAdminAuditRoutes(app: FastifyInstance): Promise<void> {
  app.get(
    "/admin-audit/events",
    { preHandler: [requireAdminAuth] },
    async () => {
      return {
        items: await getAdminAuditEvents(),
      };
    },
  );
}