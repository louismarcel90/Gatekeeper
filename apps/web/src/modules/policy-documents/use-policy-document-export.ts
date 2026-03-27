import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";

export function usePolicyDocumentExport() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["policy-document", "export"],
    queryFn: async () => {
      const response = await apiClient.get("/policy-documents/export");
      return response.data;
    },
    enabled: status === "authenticated",
  });
}