import { FastifyInstance } from "fastify";
import {
  getRuntimeMetrics,
} from "../observability/runtime-metrics";

export async function registerRuntimeMetricsRoute(
  app: FastifyInstance,
) {
  app.get("/runtime/metrics", async () => {
    return getRuntimeMetrics();
  });
}