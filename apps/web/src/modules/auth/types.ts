export type AdminRole = "viewer" | "security" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  role: AdminRole;
  created_at?: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    email: string;
    role: AdminRole;
  };
};
