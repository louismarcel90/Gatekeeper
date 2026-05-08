import { FastifyInstance } from "fastify";
import { createPolicy, listPolicies } from "../application/policy-service";
import { createPolicySchema } from "../domain/validators";
import { requireAdminAuth, requireRole } from "../middleware/admin-auth";
import { sendBadRequest, sendNotFound,sendInternalError } from "../shared/http";
import { updateManagedPolicy } from "../application/policy-service";

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
        return reply.code(201).send(created);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unexpected error while creating policy.";
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
      return reply.code(200).send(updated);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while updating policy.";

      if (message.includes("was not found")) {
        return sendNotFound(reply, message);
      }

      return sendInternalError(reply, message);
    }
  },
);
}
