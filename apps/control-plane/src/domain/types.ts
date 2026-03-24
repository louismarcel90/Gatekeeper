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
};

export type Snapshot = {
  version: number;
  generated_at: string;
  routes: ManagedRoute[];
  policies: Policy[];
};