import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { pool } from "../db/client";
import { AdminRole, AdminUser } from "../domain/types";

type AdminUserRow = {
  id: string;
  email: string;
  role: "viewer" | "security" | "admin";
  password_hash: string;
  created_at: string;
};

function mapRow(row: AdminUserRow): AdminUser {
  return {
    id: row.id,
    email: row.email,
    role: row.role,
    password_hash: row.password_hash,
    created_at: row.created_at,
  };
}

export async function createAdminUser(params: {
  email: string;
  password: string;
  role: AdminRole;
}): Promise<AdminUser> {
  const passwordHash = await bcrypt.hash(params.password, 10);

  const result = await pool.query<AdminUserRow>(
    `
    INSERT INTO admin_users (id, email, role, password_hash)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, role, password_hash, created_at
    `,
    [randomUUID(), params.email, params.role, passwordHash],
  );

  return mapRow(result.rows[0]!);
}
