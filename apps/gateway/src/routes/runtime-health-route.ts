import { FastifyInstance } from "fastify";
import { env } from "../config/env";
import { getRuntimeHealth } from "../runtime/runtime-health-registry";

export async function registerRuntimeHealthRoute(
  app: FastifyInstance,
): Promise<void> {
  app.get("/runtime/health", async () => {
    const health = getRuntimeHealth();

    return {
      instance_id: env.GATEWAY_INSTANCE_ID,
      ...health,
    };
  });
}