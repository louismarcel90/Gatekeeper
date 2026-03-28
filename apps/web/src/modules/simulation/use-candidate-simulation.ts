import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { logUiEvent } from "@/src/modules/observability/logger";

export function useCandidateSimulation() {
  return useMutation({
    mutationFn: async (payload: {
      document: unknown;
      input: {
        path: string;
        method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
        client_id?: string;
        scopes: string[];
      };
    }) => {
      logUiEvent({
        level: "info",
        scope: "simulation.candidate",
        message: "Running candidate simulation from UI",
        meta: {
          path: payload.input.path,
          method: payload.input.method,
        },
      });

      const response = await apiClient.post("/simulation/candidate-decide", payload);
      return response.data;
    },
    onSuccess: (data) => {
      logUiEvent({
        level: "success",
        scope: "simulation.candidate",
        message: `Candidate simulation completed with decision ${data.decision}`,
        meta: {
          decision: data.decision,
          reason_code: data.reason_code,
        },
      });
    },
    onError: (error) => {
      logUiEvent({
        level: "error",
        scope: "simulation.candidate",
        message: "Candidate simulation failed",
        meta: {
          error: error instanceof Error ? error.message : "unknown error",
        },
      });
    },
  });
}
