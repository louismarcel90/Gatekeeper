import { Snapshot, ManagedRoute, Policy } from "../domain/types";
import { getSnapshotByVersion } from "../infrastructure/snapshot-repository";

type ChangeType = "ADDED" | "REMOVED" | "MODIFIED";

type FieldChange = {
  field: string;
  before: string | number | boolean | null;
  after: string | number | boolean | null;
};

type RouteDiffEntry = {
  change_type: ChangeType;
  route_id: string;
  before: ManagedRoute | null;
  after: ManagedRoute | null;
  changed_fields: FieldChange[];
};

type PolicyDiffEntry = {
  change_type: ChangeType;
  policy_id: string;
  before: Policy | null;
  after: Policy | null;
  changed_fields: FieldChange[];
};

export type SnapshotDiffResult = {
  from_version: number;
  to_version: number;
  summary: {
    routes_added: number;
    routes_removed: number;
    routes_modified: number;
    policies_added: number;
    policies_removed: number;
    policies_modified: number;
    total_changes: number;
  };
  routes: RouteDiffEntry[];
  policies: PolicyDiffEntry[];
};

function normalizeStringArray(value: string[]): string {
  return [...value].sort().join(",");
}

function comparePrimitiveField(params: {
  field: string;
  before: string | number | boolean | null;
  after: string | number | boolean | null;
}): FieldChange | null {
  if (params.before === params.after) {
    return null;
  }

  return {
    field: params.field,
    before: params.before,
    after: params.after,
  };
}

function compareRoute(before: ManagedRoute, after: ManagedRoute): FieldChange[] {
  const changes: FieldChange[] = [];

  const pathChange = comparePrimitiveField({
    field: "path",
    before: before.path,
    after: after.path,
  });

  const methodChange = comparePrimitiveField({
    field: "method",
    before: before.method,
    after: after.method,
  });

  const upstreamChange = comparePrimitiveField({
    field: "upstream_url",
    before: before.upstream_url,
    after: after.upstream_url,
  });

  const enabledChange = comparePrimitiveField({
    field: "enabled",
    before: before.enabled,
    after: after.enabled,
  });

  for (const change of [pathChange, methodChange, upstreamChange, enabledChange]) {
    if (change) {
      changes.push(change);
    }
  }

  return changes;
}

function comparePolicy(before: Policy, after: Policy): FieldChange[] {
  const changes: FieldChange[] = [];

  const routeChange = comparePrimitiveField({
    field: "route_id",
    before: before.route_id,
    after: after.route_id,
  });

  const apiKeyChange = comparePrimitiveField({
    field: "require_api_key",
    before: before.require_api_key,
    after: after.require_api_key,
  });

  const scopesBefore = normalizeStringArray(before.required_scopes);
  const scopesAfter = normalizeStringArray(after.required_scopes);

  const scopesChange = comparePrimitiveField({
    field: "required_scopes",
    before: scopesBefore,
    after: scopesAfter,
  });

  const rateLimitChange = comparePrimitiveField({
    field: "rate_limit_per_minute",
    before: before.rate_limit_per_minute,
    after: after.rate_limit_per_minute,
  });

  const quotaChange = comparePrimitiveField({
    field: "quota_per_day",
    before: before.quota_per_day,
    after: after.quota_per_day,
  });

  for (const change of [routeChange, apiKeyChange, scopesChange, rateLimitChange, quotaChange]) {
    if (change) {
      changes.push(change);
    }
  }

  return changes;
}

function buildRouteDiff(fromSnapshot: Snapshot, toSnapshot: Snapshot): RouteDiffEntry[] {
  const fromRoutes = new Map(fromSnapshot.routes.map((route) => [route.id, route]));
  const toRoutes = new Map(toSnapshot.routes.map((route) => [route.id, route]));

  const allRouteIds = new Set<string>([
    ...Array.from(fromRoutes.keys()),
    ...Array.from(toRoutes.keys()),
  ]);

  const result: RouteDiffEntry[] = [];

  for (const routeId of allRouteIds) {
    const before = fromRoutes.get(routeId) ?? null;
    const after = toRoutes.get(routeId) ?? null;

    if (!before && after) {
      result.push({
        change_type: "ADDED",
        route_id: routeId,
        before: null,
        after,
        changed_fields: [],
      });
      continue;
    }

    if (before && !after) {
      result.push({
        change_type: "REMOVED",
        route_id: routeId,
        before,
        after: null,
        changed_fields: [],
      });
      continue;
    }

    if (before && after) {
      const changedFields = compareRoute(before, after);

      if (changedFields.length > 0) {
        result.push({
          change_type: "MODIFIED",
          route_id: routeId,
          before,
          after,
          changed_fields: changedFields,
        });
      }
    }
  }

  return result;
}

function buildPolicyDiff(fromSnapshot: Snapshot, toSnapshot: Snapshot): PolicyDiffEntry[] {
  const fromPolicies = new Map(fromSnapshot.policies.map((policy) => [policy.id, policy]));
  const toPolicies = new Map(toSnapshot.policies.map((policy) => [policy.id, policy]));

  const allPolicyIds = new Set<string>([
    ...Array.from(fromPolicies.keys()),
    ...Array.from(toPolicies.keys()),
  ]);

  const result: PolicyDiffEntry[] = [];

  for (const policyId of allPolicyIds) {
    const before = fromPolicies.get(policyId) ?? null;
    const after = toPolicies.get(policyId) ?? null;

    if (!before && after) {
      result.push({
        change_type: "ADDED",
        policy_id: policyId,
        before: null,
        after,
        changed_fields: [],
      });
      continue;
    }

    if (before && !after) {
      result.push({
        change_type: "REMOVED",
        policy_id: policyId,
        before,
        after: null,
        changed_fields: [],
      });
      continue;
    }

    if (before && after) {
      const changedFields = comparePolicy(before, after);

      if (changedFields.length > 0) {
        result.push({
          change_type: "MODIFIED",
          policy_id: policyId,
          before,
          after,
          changed_fields: changedFields,
        });
      }
    }
  }

  return result;
}

function countChanges<T extends { change_type: ChangeType }>(
  entries: T[],
  changeType: ChangeType,
): number {
  return entries.filter((entry) => entry.change_type === changeType).length;
}

export async function compareSnapshots(params: {
  fromVersion: number;
  toVersion: number;
}): Promise<SnapshotDiffResult> {
  const fromSnapshot = await getSnapshotByVersion(params.fromVersion);
  const toSnapshot = await getSnapshotByVersion(params.toVersion);

  if (!fromSnapshot) {
    throw new Error(`Snapshot version "${params.fromVersion}" was not found.`);
  }

  if (!toSnapshot) {
    throw new Error(`Snapshot version "${params.toVersion}" was not found.`);
  }

  const routes = buildRouteDiff(fromSnapshot, toSnapshot);
  const policies = buildPolicyDiff(fromSnapshot, toSnapshot);

  const routesAdded = countChanges(routes, "ADDED");
  const routesRemoved = countChanges(routes, "REMOVED");
  const routesModified = countChanges(routes, "MODIFIED");

  const policiesAdded = countChanges(policies, "ADDED");
  const policiesRemoved = countChanges(policies, "REMOVED");
  const policiesModified = countChanges(policies, "MODIFIED");

  return {
    from_version: params.fromVersion,
    to_version: params.toVersion,
    summary: {
      routes_added: routesAdded,
      routes_removed: routesRemoved,
      routes_modified: routesModified,
      policies_added: policiesAdded,
      policies_removed: policiesRemoved,
      policies_modified: policiesModified,
      total_changes:
        routesAdded +
        routesRemoved +
        routesModified +
        policiesAdded +
        policiesRemoved +
        policiesModified,
    },
    routes,
    policies,
  };
}
