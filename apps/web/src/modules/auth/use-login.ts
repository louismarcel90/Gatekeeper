import { useMutation } from "@tanstack/react-query";
import { loginRequest } from "./api";
import { useAuthStore } from "@/src/core/state/auth-store";

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: loginRequest,
    onSuccess: (data) => {
      setSession({
        token: data.token,
        user: data.user,
      });
    },
  });
}