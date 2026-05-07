type RuntimeMetrics = {
  allowCount: number;
  denyCount: number;
  rateLimitExceededCount: number;
};

const metrics: RuntimeMetrics = {
  allowCount: 0,
  denyCount: 0,
  rateLimitExceededCount: 0,
};

export function recordAllowDecision() {
  metrics.allowCount += 1;
}

export function recordDenyDecision() {
  metrics.denyCount += 1;
}

export function recordRateLimitExceeded() {
  metrics.rateLimitExceededCount += 1;
}

export function getRuntimeMetrics(): RuntimeMetrics {
  return metrics;
}