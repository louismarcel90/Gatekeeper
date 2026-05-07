import { runtimeLogger } from "../observability/runtime-logger";
import { runtimeRedis } from "./runtime-redis";
import { setDependencyStatus } from "./runtime-health-registry";
import { recordRedisFailure } from "../observability/runtime-metrics";

export async function checkRedisHealth(): Promise<void> {
  try {
    const pong = await runtimeRedis.ping();

    if (pong === "PONG") {
      setDependencyStatus({
        dependency: "redis",
        status: "HEALTHY",
        reason: "Redis ping succeeded.",
      });

      runtimeLogger.info("Redis health check succeeded.", {
        dependency: "redis",
        redis_response: pong,
      });

      return;
    }

    setDependencyStatus({
      dependency: "redis",
      status: "DEGRADED",
      reason: "Redis ping returned unexpected response.",
    });

    runtimeLogger.warn("Redis health check returned unexpected response.", {
      dependency: "redis",
      redis_response: pong,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Redis health check failed.";

    setDependencyStatus({
      dependency: "redis",
      status: "UNAVAILABLE",
      reason: message,
    });

    recordRedisFailure();

    runtimeLogger.error("Redis health check failed.", {
      dependency: "redis",
      error_message: message,
    });
  }
}