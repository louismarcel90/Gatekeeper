export type RuntimeRouteSnapshot = {
  id: string;
  path: string;
  method: string;
  enabled: boolean;
};

export type RuntimePolicySnapshot = {
  id: string;
  route_id: string;
  require_api_key: boolean;
  required_scopes: string[];
  rate_limit_per_minute: number | null;
  quota_per_day: number | null;
};

export type RuntimeSnapshotIntegrity = {
  algorithm: "sha256";
  hash: string;
  generated_at: string;
};

export type RuntimeSnapshotDocument = {
  version: number;
  generated_at: string;
  routes: RuntimeRouteSnapshot[];
  policies: RuntimePolicySnapshot[];
  integrity: RuntimeSnapshotIntegrity;
};
