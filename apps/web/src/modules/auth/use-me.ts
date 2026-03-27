import { useQuery } from "@tanstack/react-query";
import { getMeRequest } from "./api";
import { useAuthStore } from "@/src/core/state/auth-store";
import type { AuthUser } from "./types";

export function useMe(enabled: boolean) {
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery<AuthUser>({
    queryKey: ["auth", "me"],
    queryFn: async (): Promise<AuthUser> => {
      const user = await getMeRequest();
      setUser(user);
      return user;
    },
    enabled,
    retry: false,
    staleTime: 60_000,
    throwOnError: false,
  });
}