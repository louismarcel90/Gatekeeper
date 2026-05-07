import axios from "axios";

import { env } from "../config/env";
import {
  ActiveRuntimeSnapshot,
  setActiveSnapshot,
} from "../runtime/runtime-snapshot-store";

type SnapshotRouteResponse = {
  route_id: string;
  path: string;
  method: string;
};

type SnapshotPolicyResponse = {
  policy_id: string;
  route_id: string;
  require_api_key: boolean;
  required_scopes: string[];
  rate_limit_per_minute?: number;
};

type SnapshotResponse = {
  version: number;
  routes: SnapshotRouteResponse[];
  policies: SnapshotPolicyResponse[];
};

export async function loadRuntimeSnapshot(): Promise<void> {
  const response = await axios.get<SnapshotResponse>(
    `${env.CONTROL_PLANE_BASE_URL}/runtime/active-snapshot`,
  );

  const snapshot: ActiveRuntimeSnapshot = {
    version: response.data.version,
    loadedAt: new Date().toISOString(),
    routes: response.data.routes.map((route: SnapshotRouteResponse) => ({
      routeId: route.route_id,
      method: route.method,
      path: route.path,
    })),
    policies: response.data.policies.map((policy: SnapshotPolicyResponse) => ({
      policyId: policy.policy_id,
      routeId: policy.route_id,
      requireApiKey: policy.require_api_key,
      requiredScopes: policy.required_scopes,
      rateLimitPerMinute: policy.rate_limit_per_minute ?? 60,
    })),
  };

  setActiveSnapshot(snapshot);
}