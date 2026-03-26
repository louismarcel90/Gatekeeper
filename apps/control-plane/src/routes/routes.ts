import { FastifyInstance } from "fastify";
import { createRoute, listRoutes } from "../application/route-service";
import { createRouteSchema } from "../domain/validators";
import { requireAdminAuth, requireRole } from "../middleware/admin-auth";
import { sendBadRequest, sendInternalError } from "../shared/http";

export async function registerManagedRouteRoutes(app: FastifyInstance) {
  app.get("/routes", { preHandler: [requireAdminAuth] }, async () => {
    return {
      items: await listRoutes(),
    };
  });

  app.post(
    "/routes",
    { preHandler: [requireAdminAuth, requireRole(["security", "admin"])] },
    async (req, reply) => {
      const parsed = createRouteSchema.safeParse(req.body);

      if (!parsed.success) {
        return sendBadRequest(reply, parsed.error.message);
      }

      try {
        const created = await createRoute(parsed.data);
        return reply.code(201).send(created);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected error while creating route.";
        return sendInternalError(reply, message);
      }
    },
  );
}