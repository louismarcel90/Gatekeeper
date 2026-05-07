type RuntimeMetrics = {
  allowCount: number;
  denyCount: number;
  rateLimitExceededCount: number;
  quotaExceededCount: number;
};

declare global {
  var gatekeeperRuntimeMetrics: RuntimeMetrics | undefined;
}

function getMetricsState(): RuntimeMetrics {
  if (!globalThis.gatekeeperRuntimeMetrics) {
    globalThis.gatekeeperRuntimeMetrics = {
      allowCount: 0,
      denyCount: 0,
      rateLimitExceededCount: 0,
      quotaExceededCount: 0,
    };
  }

  return globalThis.gatekeeperRuntimeMetrics;
}

export function recordAllowDecision(): void {
  getMetricsState().allowCount += 1;
}

export function recordDenyDecision(): void {
  getMetricsState().denyCount += 1;
}

export function recordRateLimitExceeded(): void {
  getMetricsState().rateLimitExceededCount += 1;
}

export function recordQuotaExceeded(): void {
  getMetricsState().quotaExceededCount += 1;
}

export function getRuntimeMetrics(): RuntimeMetrics {
  return { ...getMetricsState() };
}