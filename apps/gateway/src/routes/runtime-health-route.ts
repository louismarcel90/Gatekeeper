import { FastifyInstance } from "fastify";
import { getRuntimeHealth } from "../runtime/runtime-health-registry";

export async function registerRuntimeHealthRoute(
  app: FastifyInstance,
): Promise<void> {
  app.get("/runtime/health", async () => {
    return getRuntimeHealth();
  });
}