import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";

export function useSimulateDecision() {
  return useMutation({
    mutationFn: async (payload: {
      path: string;
      method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
      client_id?: string;
      scopes: string[];
    }) => {
      const response = await apiClient.post("/simulation/decide", payload);
      return response.data;
    },
  });
}
