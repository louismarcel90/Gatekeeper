import { FastifyInstance } from "fastify";
import { createAdminUserAccount } from "../application/admin-user-service";
import { createAdminUserSchema } from "../domain/validators";
import { sendBadRequest, sendInternalError } from "../shared/http";

export async function registerDevAdminUserRoutes(app: FastifyInstance) {
  app.post("/_dev/admin-users", async (req, reply) => {
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
  });
}