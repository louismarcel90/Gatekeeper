import { pool } from "../db/client";
import { Snapshot } from "../domain/types";

type SnapshotRow = {
  version: number;
  generated_at: string;
  routes: Snapshot["routes"];
  policies: Snapshot["policies"];
  is_active: boolean;
};

export async function insertSnapshot(snapshot: Snapshot): Promise<Snapshot> {
  await pool.query(
    `
    INSERT INTO snapshots (version, generated_at, routes, policies, is_active)
    VALUES ($1, $2, $3::jsonb, $4::jsonb, $5)
    `,
    [
      snapshot.version,
      snapshot.generated_at,
      JSON.stringify(snapshot.routes),
      JSON.stringify(snapshot.policies),
      snapshot.is_active ?? false,
    ],
  );

  return snapshot;
}

export async function listSnapshots(): Promise<Snapshot[]> {
  const result = await pool.query<SnapshotRow>(`
    SELECT version, generated_at, routes, policies, is_active
    FROM snapshots
    ORDER BY version DESC
  `);

  return result.rows.map((row) => ({
    version: row.version,
    generated_at: row.generated_at,
    routes: row.routes,
    policies: row.policies,
    is_active: row.is_active,
  }));
}

export async function getLatestSnapshot(): Promise<Snapshot | null> {
  const result = await pool.query<SnapshotRow>(`
    SELECT version, generated_at, routes, policies, is_active
    FROM snapshots
    ORDER BY version DESC
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0]!;

  return {
    version: row.version,
    generated_at: row.generated_at,
    routes: row.routes,
    policies: row.policies,
    is_active: row.is_active,
  };
}

export async function getActiveSnapshot(): Promise<Snapshot | null> {
  const result = await pool.query<SnapshotRow>(`
    SELECT version, generated_at, routes, policies, is_active
    FROM snapshots
    WHERE is_active = TRUE
    ORDER BY version DESC
    LIMIT 1
  `);

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0]!;

  return {
    version: row.version,
    generated_at: row.generated_at,
    routes: row.routes,
    policies: row.policies,
    is_active: row.is_active,
  };
}

export async function getSnapshotByVersion(version: number): Promise<Snapshot | null> {
  const result = await pool.query<SnapshotRow>(
    `
    SELECT version, generated_at, routes, policies, is_active
    FROM snapshots
    WHERE version = $1
    LIMIT 1
    `,
    [version],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const row = result.rows[0]!;

  return {
    version: row.version,
    generated_at: row.generated_at,
    routes: row.routes,
    policies: row.policies,
    is_active: row.is_active,
  };
}

export async function getNextSnapshotVersion(): Promise<number> {
  const result = await pool.query<{ next_version: number }>(`
    SELECT COALESCE(MAX(version), 0) + 1 AS next_version
    FROM snapshots
  `);

  return result.rows[0]?.next_version ?? 1;
}

export async function activateSnapshot(version: number): Promise<void> {
  await pool.query(`UPDATE snapshots SET is_active = FALSE WHERE is_active = TRUE`);
  await pool.query(`UPDATE snapshots SET is_active = TRUE WHERE version = $1`, [version]);
}
