import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";

export type SnapshotDiffChangeType = "ADDED" | "REMOVED" | "MODIFIED";

export type SnapshotDiffFieldChange = {
  field: string;
  before: string | number | boolean | null;
  after: string | number | boolean | null;
};

export type SnapshotRouteDiffEntry = {
  change_type: SnapshotDiffChangeType;
  route_id: string;
  changed_fields: SnapshotDiffFieldChange[];
};

export type SnapshotPolicyDiffEntry = {
  change_type: SnapshotDiffChangeType;
  policy_id: string;
  changed_fields: SnapshotDiffFieldChange[];
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
  routes: SnapshotRouteDiffEntry[];
  policies: SnapshotPolicyDiffEntry[];
};

export function useSnapshotDiff(params: { fromVersion: number | null; toVersion: number | null }) {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["snapshots", "diff", params.fromVersion, params.toVersion],
    queryFn: async () => {
      const response = await apiClient.get<SnapshotDiffResult>("/snapshots/diff", {
        params: {
          from: params.fromVersion,
          to: params.toVersion,
        },
      });

      return response.data;
    },
    enabled: status === "authenticated" && params.fromVersion !== null && params.toVersion !== null,
    staleTime: 5000,
  });
}
