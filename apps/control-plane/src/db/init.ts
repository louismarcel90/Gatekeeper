import { pool } from "./client";

export async function initDatabase(): Promise<void> {
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
      policies JSONB NOT NULL
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
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  await pool.query(`
    ALTER TABLE policies
    ADD COLUMN IF NOT EXISTS quota_per_day INTEGER NULL;
  `);
}