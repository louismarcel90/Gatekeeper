"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuthStore } from "../state/auth-store";
import { useMe } from "@/src/modules/auth/use-me";

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const router = useRouter();
  const pathname = usePathname();

  const token = useAuthStore((state) => state.token);
  const status = useAuthStore((state) => state.status);
  const hydrateToken = useAuthStore((state) => state.hydrateToken);
  const logout = useAuthStore((state) => state.logout);
  const setStatus = useAuthStore((state) => state.setStatus);

  useEffect(() => {
    hydrateToken();
  }, [hydrateToken]);

  const meQuery = useMe(Boolean(token));

  useEffect(() => {
    if (!token) {
      setStatus("unauthenticated");
      return;
    }

    if (meQuery.isError) {
      logout();
      return;
    }

    if (meQuery.isSuccess) {
      setStatus("authenticated");
      return;
    }

    if (meQuery.isPending) {
      setStatus("loading");
    }
  }, [token, meQuery.isPending, meQuery.isError, meQuery.isSuccess, logout, setStatus]);

  useEffect(() => {
    const isLoginPage = pathname === "/login";

    if (status === "unauthenticated" && !isLoginPage) {
      router.replace("/login");
      return;
    }

    if (status === "authenticated" && isLoginPage) {
      router.replace("/");
    }
  }, [pathname, router, status]);

  if (status === "idle" || status === "loading") {
    return <div style={{ padding: 24 }}>Loading session...</div>;
  }

  return <>{children}</>;
}