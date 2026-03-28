import { FastifyInstance } from "fastify";
import { createAdminUserAccount, getAdminUsers } from "../application/admin-user-service";
import { createAdminUserSchema } from "../domain/validators";
import { requireAdminAuth, requireRole } from "../middleware/admin-auth";
import { sendBadRequest, sendInternalError } from "../shared/http";

export async function registerAdminUserRoutes(app: FastifyInstance) {
  app.get("/admin-users", { preHandler: [requireAdminAuth, requireRole(["admin"])] }, async () => {
    return {
      items: await getAdminUsers(),
    };
  });

  app.post(
    "/admin-users",
    { preHandler: [requireAdminAuth, requireRole(["admin"])] },
    async (req, reply) => {
      const parsed = createAdminUserSchema.safeParse(req.body);

      if (!parsed.success) {
        return sendBadRequest(reply, parsed.error.message);
      }

      try {
        const created = await createAdminUserAccount(parsed.data);
        return reply.code(201).send(created);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected error while creating admin user.";

        return sendInternalError(reply, message);
      }
    },
  );
}
