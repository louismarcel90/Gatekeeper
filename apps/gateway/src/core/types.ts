export type DecisionType = "ALLOW" | "DENY" | "THROTTLE";

export type DecisionReasonCode =
  | "OK"
  | "SNAPSHOT_MISSING"
  | "ROUTE_NOT_FOUND"
  | "ROUTE_DISABLED"
  | "POLICY_NOT_FOUND"
  | "API_KEY_MISSING"
  | "JWT_INVALID"
  | "SCOPE_MISSING"
  | "RATE_LIMIT_EXCEEDED"
  | "QUOTA_EXCEEDED";

export type Decision = {
  decision_id: string;
  decision: DecisionType;
  reason_code: DecisionReasonCode;
  policy_id?: string;
  route_id?: string;
  matched_rule?: string;
  explanation: string;
  snapshot_version?: number;
  rate_limit?: {
    limit: number;
    current: number;
    retry_after_seconds: number;
  };
  quota?: {
    limit: number;
    current: number;
    retry_after_seconds: number;
  };
  timestamp: string;
};

export type SnapshotIntegrity = {
  algorithm: "sha256";
  hash: string;
  generated_at: string;
};

export type JwtClaims = {
  sub?: string;
  client_id?: string;
  scope?: string;
  iat?: number;
  exp?: number;
};

export type RequestContext = {
  method: string;
  path: string;
  headers: Record<string, string | string[] | undefined>;
  ip: string;
  client_id?: string;
  scopes: string[];
  auth: {
    api_key_present: boolean;
    bearer_present: boolean;
    jwt_valid: boolean;
    jwt_invalid_reason?: string;
    subject?: string;
  };
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
  quota_per_day: number | null;
};

export type Snapshot = {
  version: number;
  generated_at: string;
  routes: ManagedRoute[];
  policies: Policy[];
  integrity: SnapshotIntegrity;

};

