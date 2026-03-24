export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type ManagedRoute = {
  id: string;
  path: string;
  method: HttpMethod;
  upstream_url: string;
  enabled: boolean;
};

export type Policy = {
  id: string;
  route_id: string;
  require_api_key: boolean;
  required_scopes: string[];
  rate_limit_per_minute: number | null;
  quota_per_day: number | null;
};

export type Snapshot = {
  version: number;
  generated_at: string;
  routes: ManagedRoute[];
  policies: Policy[];
};

export type DecisionAuditLog = {
  id: string;
  decision_id: string;
  decision: "ALLOW" | "DENY" | "THROTTLE";
  reason_code: string;
  route_id: string | null;
  policy_id: string | null;
  client_id: string | null;
  path: string;
  method: string;
  ip: string;
  matched_rule: string | null;
  explanation: string;
  snapshot_version: number | null;
  created_at: string;
};