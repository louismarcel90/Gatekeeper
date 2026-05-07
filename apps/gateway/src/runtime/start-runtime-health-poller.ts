import { checkRedisHealth } from "./redis-health-checker";

export function startRuntimeHealthPoller(): void {
  setInterval(() => {
    void checkRedisHealth();
  }, 5000);

  void checkRedisHealth();
}