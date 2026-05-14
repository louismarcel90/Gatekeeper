import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { AdminUser } from "../domain/types";
import { LoginInput } from "../domain/validators";
import { findAdminUserByEmail, findAdminUserById } from "../infrastructure/admin-user-repository";

type AuthTokenPayload = {
  sub: string;
  email: string;
  role: "viewer" | "security" | "admin";
};

export async function loginAdmin(input: LoginInput): Promise<{
  token: string;
  user: Pick<AdminUser, "id" | "email" | "role">;
}> {
  const user = await findAdminUserByEmail(input.email);

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const valid = await bcrypt.compare(input.password, user.password_hash);

  if (!valid) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      client_id: "admin-client",
      scope: "search:read",
    },
    env.ADMIN_JWT_SECRET,
    {
      algorithm: "HS256",
      expiresIn: "12h",
    },
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
}

export function verifyAdminToken(token: string): AuthTokenPayload {
  const decoded = jwt.verify(token, env.ADMIN_JWT_SECRET);

  if (typeof decoded === "string") {
    throw new Error("INVALID_ADMIN_TOKEN");
  }

  if (
    typeof decoded.sub !== "string" ||
    typeof decoded.email !== "string" ||
    (decoded.role !== "viewer" && decoded.role !== "security" && decoded.role !== "admin")
  ) {
    throw new Error("INVALID_ADMIN_TOKEN");
  }

  return {
    sub: decoded.sub,
    email: decoded.email,
    role: decoded.role,
  };
}

export async function getAdminProfile(
  userId: string,
): Promise<Pick<AdminUser, "id" | "email" | "role" | "created_at"> | null> {
  const user = await findAdminUserById(userId);

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    created_at: user.created_at,
  };
}
