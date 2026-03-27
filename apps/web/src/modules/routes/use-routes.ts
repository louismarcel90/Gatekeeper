import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/src/core/api/client";
import { useAuthStore } from "@/src/core/state/auth-store";

export function useRoutes() {
  const status = useAuthStore((state) => state.status);

  return useQuery({
    queryKey: ["routes"],
    queryFn: async () => {
      const res = await apiClient.get("/routes");
      return res.data.items;
    },
    enabled: status === "authenticated",
  });
}