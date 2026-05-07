type RuntimeMetrics = {
  startedAt: string;
  allowCount: number;
  denyCount: number;
  throttleCount: number;
  rateLimitExceededCount: number;
  quotaExceededCount: number;
  snapshotRefreshSuccessCount: number;
  snapshotRefreshFailureCount: number;
  redisFailureCount: number;
};

declare global {
  var gatekeeperRuntimeMetrics: RuntimeMetrics | undefined;
}

function createInitialMetrics(): RuntimeMetrics {
  return {
    startedAt: new Date().toISOString(),
    allowCount: 0,
    denyCount: 0,
    throttleCount: 0,
    rateLimitExceededCount: 0,
    quotaExceededCount: 0,
    snapshotRefreshSuccessCount: 0,
    snapshotRefreshFailureCount: 0,
    redisFailureCount: 0,
  };
}

function getMetricsState(): RuntimeMetrics {
  if (!globalThis.gatekeeperRuntimeMetrics) {
    globalThis.gatekeeperRuntimeMetrics = createInitialMetrics();
  }

  return globalThis.gatekeeperRuntimeMetrics;
}

export function recordAllowDecision(): void {
  getMetricsState().allowCount += 1;
}

export function recordDenyDecision(): void {
  getMetricsState().denyCount += 1;
}

export function recordThrottleDecision(): void {
  getMetricsState().throttleCount += 1;
}

export function recordRateLimitExceeded(): void {
  getMetricsState().rateLimitExceededCount += 1;
}

export function recordQuotaExceeded(): void {
  getMetricsState().quotaExceededCount += 1;
}

export function recordSnapshotRefreshSuccess(): void {
  getMetricsState().snapshotRefreshSuccessCount += 1;
}

export function recordSnapshotRefreshFailure(): void {
  getMetricsState().snapshotRefreshFailureCount += 1;
}

export function recordRedisFailure(): void {
  getMetricsState().redisFailureCount += 1;
}

export function getRuntimeMetrics(): RuntimeMetrics {
  return { ...getMetricsState() };
}