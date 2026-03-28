import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { controlPlaneConfig } from "../config/env";
import { pool } from "./client";

export async function initDatabase(): Promise<void> {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      role TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS managed_routes (
      id TEXT PRIMARY KEY,
      path TEXT NOT NULL,
      method TEXT NOT NULL,
      upstream_url TEXT NOT NULL,
      enabled BOOLEAN NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS policies (
      id TEXT PRIMARY KEY,
      route_id TEXT NOT NULL REFERENCES managed_routes(id) ON DELETE CASCADE,
      require_api_key BOOLEAN NOT NULL,
      required_scopes JSONB NOT NULL,
      rate_limit_per_minute INTEGER NULL,
      quota_per_day INTEGER NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS snapshots (
      version INTEGER PRIMARY KEY,
      generated_at TIMESTAMPTZ NOT NULL,
      routes JSONB NOT NULL,
      policies JSONB NOT NULL,
      is_active BOOLEAN NOT NULL DEFAULT FALSE
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS decision_audit_logs (
      id TEXT PRIMARY KEY,
      decision_id TEXT NOT NULL,
      decision TEXT NOT NULL,
      reason_code TEXT NOT NULL,
      route_id TEXT NULL,
      policy_id TEXT NULL,
      client_id TEXT NULL,
      path TEXT NOT NULL,
      method TEXT NOT NULL,
      ip TEXT NOT NULL,
      matched_rule TEXT NULL,
      explanation TEXT NOT NULL,
      snapshot_version INTEGER NULL,
      request_id TEXT NULL,
      actor_user_id TEXT NULL,
      actor_email TEXT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS deployment_history (
      id TEXT PRIMARY KEY,
      snapshot_version INTEGER NOT NULL REFERENCES snapshots(version) ON DELETE CASCADE,
      action TEXT NOT NULL,
      request_id TEXT NULL,
      actor_user_id TEXT NULL,
      actor_email TEXT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    ALTER TABLE policies
    ADD COLUMN IF NOT EXISTS quota_per_day INTEGER NULL;
  `);

  await pool.query(`
    ALTER TABLE snapshots
    ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT FALSE;
  `);

  await pool.query(`
    ALTER TABLE decision_audit_logs
    ADD COLUMN IF NOT EXISTS request_id TEXT NULL;
  `);

  await pool.query(`
    ALTER TABLE decision_audit_logs
    ADD COLUMN IF NOT EXISTS actor_user_id TEXT NULL;
  `);

  await pool.query(`
    ALTER TABLE decision_audit_logs
    ADD COLUMN IF NOT EXISTS actor_email TEXT NULL;
  `);

  await pool.query(`
    ALTER TABLE deployment_history
    ADD COLUMN IF NOT EXISTS request_id TEXT NULL;
  `);

  await pool.query(`
    ALTER TABLE deployment_history
    ADD COLUMN IF NOT EXISTS actor_user_id TEXT NULL;
  `);

  await pool.query(`
    ALTER TABLE deployment_history
    ADD COLUMN IF NOT EXISTS actor_email TEXT NULL;
  `);

  const existingAdmin = await pool.query<{ email: string }>(
    `
    SELECT email
    FROM admin_users
    WHERE email = $1
    LIMIT 1
    `,
    [controlPlaneConfig.adminSeedEmail],
  );

  if (existingAdmin.rows.length === 0) {
    const passwordHash = await bcrypt.hash(controlPlaneConfig.adminSeedPassword, 10);

    await pool.query(
      `
      INSERT INTO admin_users (id, email, role, password_hash)
      VALUES ($1, $2, $3, $4)
      `,
      [randomUUID(), controlPlaneConfig.adminSeedEmail, "admin", passwordHash],
    );
  }
}
