import { FastifyInstance } from "fastify";
import {
  createPolicy,
  listPolicies,
  updateManagedPolicy,
} from "../application/policy-service";
import { createPolicySchema } from "../domain/validators";
import { requireAdminAuth, requireRole } from "../middleware/admin-auth";
import { sendBadRequest, sendInternalError, sendNotFound } from "../shared/http";
import { publishDomainEvent } from "../events/domain-event-bus";

export async function registerPolicyRoutes(app: FastifyInstance) {
  app.get("/policies", { preHandler: [requireAdminAuth] }, async () => {
    return {
      items: await listPolicies(),
    };
  });

  app.post(
    "/policies",
    { preHandler: [requireAdminAuth, requireRole(["security", "admin"])] },
    async (req, reply) => {
      const parsed = createPolicySchema.safeParse(req.body);

      if (!parsed.success) {
        return sendBadRequest(reply, parsed.error.message);
      }

      try {
        const created = await createPolicy(parsed.data);

        await publishDomainEvent({
          name: "policy.created",
          payload: {
            resource_id: created.id,
            resource_type: "policy",
            action: "create",
            metadata: {
              route_id: created.route_id,
              require_api_key: created.require_api_key,
              rate_limit_per_minute: created.rate_limit_per_minute,
              quota_per_day: created.quota_per_day,
            },
          },
        });

        return reply.code(201).send(created);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unexpected error while creating policy.";

        return sendInternalError(reply, message);
      }
    },
  );

  app.put(
    "/policies/:id",
    { preHandler: [requireAdminAuth, requireRole(["security", "admin"])] },
    async (req, reply) => {
      const params = req.params as { id: string };

      const parsed = createPolicySchema.safeParse({
        ...(req.body as {
          route_id?: string;
          require_api_key?: boolean;
          required_scopes?: string[];
          rate_limit_per_minute?: number | null;
          quota_per_day?: number | null;
        }),
        id: params.id,
      });

      if (!parsed.success) {
        return sendBadRequest(reply, parsed.error.message);
      }

      try {
        const updated = await updateManagedPolicy(parsed.data);

        await publishDomainEvent({
          name: "policy.updated",
          payload: {
            resource_id: updated.id,
            resource_type: "policy",
            action: "update",
            metadata: {
              route_id: updated.route_id,
              require_api_key: updated.require_api_key,
              rate_limit_per_minute: updated.rate_limit_per_minute,
              quota_per_day: updated.quota_per_day,
            },
          },
        });

        return reply.code(200).send(updated);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unexpected error while updating policy.";

        if (message.includes("was not found")) {
          return sendNotFound(reply, message);
        }

        return sendInternalError(reply, message);
      }
    },
  );
}