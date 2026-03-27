import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";

export function useImportPolicyDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (document: unknown) => {
      const response = await apiClient.post("/policy-documents/import", document);
      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["policy-document", "export"] }),
        queryClient.invalidateQueries({ queryKey: ["routes"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
      ]);
    },
  });
}