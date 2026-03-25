import { FastifyInstance } from "fastify";
import { getDeploymentHistory } from "../application/deployment-service";
import { deploymentHistoryQuerySchema } from "../domain/validators";
import { sendBadRequest } from "../shared/http";

export async function registerDeploymentRoutes(app: FastifyInstance) {
  app.get("/deployments/history", async (req, reply) => {
    const parsed = deploymentHistoryQuerySchema.safeParse(req.query);

    if (!parsed.success) {
      return sendBadRequest(reply, parsed.error.message);
    }

    const items = await getDeploymentHistory(parsed.data);

    return {
      items,
      pagination: {
        limit: parsed.data.limit,
        offset: parsed.data.offset,
      },
      filters: parsed.data,
    };
  });
}