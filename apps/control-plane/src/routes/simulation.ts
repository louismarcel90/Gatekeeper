import { FastifyInstance } from "fastify";
import { simulateDecision } from "../simulation/simulation-service";
import { simulateDecisionSchema } from "../domain/validators";
import { requireAdminAuth } from "../middleware/admin-auth";
import { sendBadRequest, sendInternalError } from "../shared/http";

export async function registerSimulationRoutes(app: FastifyInstance) {
  app.post("/simulation/decide", { preHandler: [requireAdminAuth] }, async (req, reply) => {
    const parsed = simulateDecisionSchema.safeParse(req.body);

    if (!parsed.success) {
      return sendBadRequest(reply, parsed.error.message);
    }

    try {
      const result = await simulateDecision(parsed.data);
      return reply.code(200).send(result);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unexpected error while simulating decision.";
      return sendInternalError(reply, message);
    }
  });
}
