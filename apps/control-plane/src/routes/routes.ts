import { FastifyInstance } from "fastify";
import { createRoute, listRoutes } from "../application/route-service";
import { createRouteSchema } from "../domain/validators";
import { sendBadRequest, sendInternalError } from "../shared/http";

export async function registerManagedRouteRoutes(app: FastifyInstance) {
  app.get("/routes", async () => {
    return {
      items: listRoutes()
    };
  });

  app.post("/routes", async (req, reply) => {
    const parsed = createRouteSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendBadRequest(reply, parsed.error.message);
    }

    try {
      const created = createRoute(parsed.data);
      return reply.code(201).send(created);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while creating route.";
      return sendInternalError(reply, message);
    }
  });
}