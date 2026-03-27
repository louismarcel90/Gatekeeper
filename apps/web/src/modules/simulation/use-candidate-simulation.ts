import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";

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
      const response = await apiClient.post("/simulation/candidate-decide", payload);
      return response.data;
    },
  });
}