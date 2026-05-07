import { FastifyInstance } from "fastify";
import { env } from "../config/env";
import { getRuntimeMetrics } from "../observability/runtime-metrics";

export async function registerRuntimeMetricsRoute(
  app: FastifyInstance,
): Promise<void> {
  app.get("/runtime/metrics", async () => {
    return {
      instance_id: env.GATEWAY_INSTANCE_ID,
      metrics: getRuntimeMetrics(),
    };
  });
}