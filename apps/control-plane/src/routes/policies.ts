import { FastifyInstance } from "fastify";
import { createPolicy, listPolicies } from "../application/policy-service";
import { createPolicySchema } from "../domain/validators";
import { requireAdminAuth, requireRole } from "../middleware/admin-auth";
import { sendBadRequest, sendInternalError } from "../shared/http";

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
}
