import { FastifyInstance } from "fastify";
import { getDeploymentHistory } from "../application/deployment-service";

export async function registerDeploymentRoutes(app: FastifyInstance) {
  app.get("/deployments/history", async () => {
    return {
      items: await getDeploymentHistory(),
    };
  });
}