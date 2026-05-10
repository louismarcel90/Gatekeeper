import { FastifyInstance } from "fastify";
import {
  createRoute,
  listRoutes,
  updateManagedRoute,
  updateManagedRouteEnabled,
} from "../application/route-service";
import { createRouteSchema } from "../domain/validators";
import { requireAdminAuth, requireRole } from "../middleware/admin-auth";
import { sendBadRequest, sendInternalError, sendNotFound } from "../shared/http";
import { publishDomainEvent } from "../events/domain-event-bus";

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

        await publishDomainEvent({
          name: "route.created",
          payload: {
            resource_id: created.id,
            resource_type: "managed_route",
            action: "create",
            metadata: {
              path: created.path,
              method: created.method,
              enabled: created.enabled,
            },
          },
        });

        return reply.code(201).send(created);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected error while creating route.";

        return sendInternalError(reply, message);
      }
    },
  );

  app.put(
    "/routes/:id",
    { preHandler: [requireAdminAuth, requireRole(["security", "admin"])] },
    async (req, reply) => {
      const params = req.params as { id: string };

      const parsed = createRouteSchema.safeParse({
        ...(req.body as Record<string, string | boolean>),
        id: params.id,
      });

      if (!parsed.success) {
        return sendBadRequest(reply, parsed.error.message);
      }

      try {
        const updated = await updateManagedRoute(parsed.data);

        await publishDomainEvent({
          name: "route.updated",
          payload: {
            resource_id: updated.id,
            resource_type: "managed_route",
            action: "update",
            metadata: {
              path: updated.path,
              method: updated.method,
              enabled: updated.enabled,
            },
          },
        });

        return reply.code(200).send(updated);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected error while updating route.";

        if (message.includes("was not found")) {
          return sendNotFound(reply, message);
        }

        return sendInternalError(reply, message);
      }
    },
  );

  app.patch(
    "/routes/:id/enabled",
    { preHandler: [requireAdminAuth, requireRole(["security", "admin"])] },
    async (req, reply) => {
      const params = req.params as { id: string };
      const body = req.body as { enabled?: boolean };

      if (typeof body.enabled !== "boolean") {
        return sendBadRequest(reply, "Field enabled must be a boolean.");
      }

      try {
        const updated = await updateManagedRouteEnabled({
          id: params.id,
          enabled: body.enabled,
        });

        await publishDomainEvent({
          name: "route.lifecycle_changed",
          payload: {
            resource_id: updated.id,
            resource_type: "managed_route",
            action: updated.enabled ? "enable" : "disable",
            metadata: {
              enabled: updated.enabled,
            },
          },
        });

        return reply.code(200).send({
          route: updated,
          lifecycle_action: updated.enabled ? "ROUTE_ENABLED" : "ROUTE_DISABLED",
          message: updated.enabled
            ? "Route enabled in control plane configuration."
            : "Route disabled in control plane configuration.",
        });
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unexpected error while updating route lifecycle.";

        if (message.includes("was not found")) {
          return sendNotFound(reply, message);
        }

        return sendInternalError(reply, message);
      }
    },
  );
}
