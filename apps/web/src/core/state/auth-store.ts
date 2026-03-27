import { create } from "zustand";
import { AuthUser } from "@/src/modules/auth/types";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  status: AuthStatus;
  setSession: (params: { token: string; user: AuthUser | null }) => void;
  setUser: (user: AuthUser | null) => void;
  setStatus: (status: AuthStatus) => void;
  hydrateToken: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  user: null,
  status: "idle",

  setSession: ({ token, user }) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_token", token);
    }

    set({
      token,
      user,
      status: "authenticated",
    });
  },

  setUser: (user) => {
    set((state) => ({
      ...state,
      user,
      status: user ? "authenticated" : "unauthenticated",
    }));
  },

  setStatus: (status) => {
    set((state) => ({
      ...state,
      status,
    }));
  },

  hydrateToken: () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;

    set((state) => ({
      ...state,
      token,
      status: token ? "loading" : "unauthenticated",
    }));
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_token");
    }

    set({
      token: null,
      user: null,
      status: "unauthenticated",
    });
  },
}));