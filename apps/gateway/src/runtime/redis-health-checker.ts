import { runtimeRedis } from "./runtime-redis";
import { setDependencyStatus } from "./runtime-health-registry";

export async function checkRedisHealth(): Promise<void> {
  try {
    const pong = await runtimeRedis.ping();

    if (pong === "PONG") {
      setDependencyStatus({
        dependency: "redis",
        status: "HEALTHY",
        reason: "Redis ping succeeded.",
      });
      return;
    }

    setDependencyStatus({
      dependency: "redis",
      status: "DEGRADED",
      reason: "Redis ping returned unexpected response.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Redis health check failed.";

    setDependencyStatus({
      dependency: "redis",
      status: "UNAVAILABLE",
      reason: message,
    });
  }
}