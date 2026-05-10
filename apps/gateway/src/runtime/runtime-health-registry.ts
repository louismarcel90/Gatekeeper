import { GatewayDependencyName, GatewayDependencyStatus, GatewayFailureMode } from "./failure-mode";

type RuntimeHealthState = {
  dependencies: Record<GatewayDependencyName, GatewayFailureMode>;
};

function createInitialDependency(dependency: GatewayDependencyName): GatewayFailureMode {
  return {
    dependency,
    status: "HEALTHY",
    reason: "Initial state.",
    lastCheckedAt: new Date().toISOString(),
  };
}

const state: RuntimeHealthState = {
  dependencies: {
    "control-plane": createInitialDependency("control-plane"),
    redis: createInitialDependency("redis"),
    "snapshot-cache": createInitialDependency("snapshot-cache"),
    upstream: createInitialDependency("upstream"),
  },
};

export function setDependencyStatus(params: {
  dependency: GatewayDependencyName;
  status: GatewayDependencyStatus;
  reason: string;
}): void {
  state.dependencies[params.dependency] = {
    dependency: params.dependency,
    status: params.status,
    reason: params.reason,
    lastCheckedAt: new Date().toISOString(),
  };
}

export function getDependencyStatus(dependency: GatewayDependencyName): GatewayFailureMode {
  return state.dependencies[dependency];
}

export function getRuntimeHealth(): {
  status: GatewayDependencyStatus;
  dependencies: GatewayFailureMode[];
} {
  const dependencies = Object.values(state.dependencies);

  if (dependencies.some((item) => item.status === "UNAVAILABLE")) {
    return {
      status: "UNAVAILABLE",
      dependencies,
    };
  }

  if (dependencies.some((item) => item.status === "DEGRADED")) {
    return {
      status: "DEGRADED",
      dependencies,
    };
  }

  return {
    status: "HEALTHY",
    dependencies,
  };
}
