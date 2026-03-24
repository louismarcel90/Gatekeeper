export type DecisionType = "ALLOW" | "DENY" | "THROTTLE";

export type Decision = {
  decision: DecisionType;
  reason_code: string;
  policy_id?: string;
  route_id?: string;
  explanation?: string;
  timestamp: string;
};

export type RequestContext = {
  method: string;
  path: string;
  headers: Record<string, string | string[] | undefined>;
  ip: string;
  client_id?: string;
};

export type ManagedRoute = {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  upstream_url: string;
  enabled: boolean;
};

export type Policy = {
  id: string;
  route_id: string;
  require_api_key: boolean;
  required_scopes: string[];
  rate_limit_per_minute: number | null;
};

export type Snapshot = {
  version: number;
  generated_at: string;
  routes: ManagedRoute[];
  policies: Policy[];
};