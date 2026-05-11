import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export type RuntimeDashboard = {
  generated_at: string;

  snapshot: {
    status: string;
    activeSnapshot: {
      version: number;
      generated_at: string;
    } | null;
  };

  dependencies: {
    redis_failure_count: number;

    health: {
      status: string;

      dependencies: Array<{
        dependency: string;
        status: string;
        message: string;
      }>;
    };
  };

  tracing: {
    enabled: boolean;
    service_name: string;
    exporter_endpoint: string;
  };

  operational_summary: {
    runtime_ready: boolean;
    using_last_known_good_snapshot: boolean;
    redis_degraded: boolean;
  };

  integrity: {
    verified: boolean;
    verifiedAt: string | null;
    activeSnapshotHash: string | null;
    failureReason: string | null;
  };
};

async function fetchRuntimeDashboard(): Promise<RuntimeDashboard> {
  const response = await axios.get<RuntimeDashboard>(
    "http://localhost:3002/runtime/dashboard",
  );

  return response.data;
}

export function useRuntimeDashboard() {
  return useQuery({
    queryKey: ["runtime-dashboard"],
    queryFn: fetchRuntimeDashboard,
    refetchInterval: 5000,
  });
}