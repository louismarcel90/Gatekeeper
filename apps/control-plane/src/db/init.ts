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
      rate_limit_per_minute INTEGER NULL
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
}