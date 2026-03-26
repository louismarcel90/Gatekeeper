import { FastifyInstance } from "fastify";
import { simulateCandidateDecision } from "../application/candidate-simulation-service";
import { candidateSimulationSchema } from "../domain/validators";
import { requireAdminAuth, requireRole } from "../middleware/admin-auth";
import { sendBadRequest, sendInternalError } from "../shared/http";

export async function registerCandidateSimulationRoutes(app: FastifyInstance) {
  app.post(
    "/simulation/candidate-decide",
    { preHandler: [requireAdminAuth, requireRole(["security", "admin"])] },
    async (req, reply) => {
      const parsed = candidateSimulationSchema.safeParse(req.body);

      if (!parsed.success) {
        return sendBadRequest(reply, parsed.error.message);
      }

      try {
        const result = simulateCandidateDecision({
          document: parsed.data.document,
          input: {
            path: parsed.data.input.path,
            method: parsed.data.input.method,
            client_id: parsed.data.input.client_id,
            scopes: parsed.data.input.scopes,
          },
        });

        return reply.code(200).send(result);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Unexpected error while simulating candidate decision.";
        return sendInternalError(reply, message);
      }
    },
  );
}