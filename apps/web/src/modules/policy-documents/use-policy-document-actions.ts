import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { logUiEvent } from "@/src/modules/observability/logger";

export function useImportPolicyDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (document: unknown) => {
      logUiEvent({
        level: "info",
        scope: "policyDocuments.import",
        message: "Importing policy document from UI",
      });

      const response = await apiClient.post("/policy-documents/import", document);
      return response.data;
    },
    onSuccess: async () => {
      logUiEvent({
        level: "success",
        scope: "policyDocuments.import",
        message: "Policy document imported successfully",
      });

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["policy-document", "export"] }),
        queryClient.invalidateQueries({ queryKey: ["routes"] }),
        queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
      ]);
    },
    onError: (error) => {
      logUiEvent({
        level: "error",
        scope: "policyDocuments.import",
        message: "Policy document import failed",
        meta: {
          error: error instanceof Error ? error.message : "unknown error",
        },
      });
    },
  });
}