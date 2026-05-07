export type GatewayDependencyName =
  | "control-plane"
  | "redis"
  | "snapshot-cache"
  | "upstream";

export type GatewayDependencyStatus =
  | "HEALTHY"
  | "DEGRADED"
  | "UNAVAILABLE";

export type GatewayFailureMode = {
  dependency: GatewayDependencyName;
  status: GatewayDependencyStatus;
  reason: string;
  lastCheckedAt: string;
};