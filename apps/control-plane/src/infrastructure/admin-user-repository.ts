import { pool } from "../db/client";
import { AdminUser } from "../domain/types";

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

export async function findAdminUserByEmail(email: string): Promise<AdminUser | null> {
  const result = await pool.query<AdminUserRow>(
    `
    SELECT id, email, role, password_hash, created_at
    FROM admin_users
    WHERE email = $1
    LIMIT 1
    `,
    [email],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapRow(result.rows[0]!);
}

export async function findAdminUserById(id: string): Promise<AdminUser | null> {
  const result = await pool.query<AdminUserRow>(
    `
    SELECT id, email, role, password_hash, created_at
    FROM admin_users
    WHERE id = $1
    LIMIT 1
    `,
    [id],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapRow(result.rows[0]!);
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const result = await pool.query<AdminUserRow>(
    `
    SELECT id, email, role, password_hash, created_at
    FROM admin_users
    ORDER BY created_at DESC
    `,
  );

  return result.rows.map(mapRow);
}
