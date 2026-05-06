import type { FastifyInstance } from "fastify";

type RuntimeRouteSnapshot = {
  route_id: string;
  path: string;
  method: string;
};

type RuntimePolicySnapshot = {
  policy_id: string;
  route_id: string;
  require_api_key: boolean;
  required_scopes: string[];
};

type RuntimeSnapshotResponse = {
  version: number;
  routes: RuntimeRouteSnapshot[];
  policies: RuntimePolicySnapshot[];
};

export async function registerRuntimeRoutes(
  app: FastifyInstance,
): Promise<void> {
  app.get("/runtime/active-snapshot", async (): Promise<RuntimeSnapshotResponse> => {
    return {
      version: 1,
      routes: [
        {
          route_id: "route_search",
          path: "/search",
          method: "GET",
        },
        {
          route_id: "route_orders",
          path: "/orders",
          method: "GET",
        },
      ],
      policies: [
        {
          policy_id: "policy_search_read",
          route_id: "route_search",
          require_api_key: false,
          required_scopes: ["search:read"],
        },
        {
          policy_id: "policy_orders_read",
          route_id: "route_orders",
          require_api_key: false,
          required_scopes: ["orders:read"],
        },
      ],
    };
  });
}