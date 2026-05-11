import { pool } from "../db/client";
import { Snapshot } from "../domain/types";

type SnapshotRow = {
  version: number;
  generated_at: string;
  routes: Snapshot["routes"];
  policies: Snapshot["policies"];
  integrity: Snapshot["integrity"];
  is_active: boolean;
};

function mapSnapshotRow(row: SnapshotRow): Snapshot {
  return {
    version: row.version,
    generated_at: row.generated_at,
    routes: row.routes,
    policies: row.policies,
    integrity: row.integrity,
    is_active: row.is_active,
  };
}

export async function insertSnapshot(snapshot: Snapshot): Promise<Snapshot> {
  const result = await pool.query<SnapshotRow>(
    `
    INSERT INTO snapshots (
      version,
      generated_at,
      routes,
      policies,
      integrity,
      is_active
    )
    VALUES ($1, $2, $3::jsonb, $4::jsonb, $5::jsonb, $6)
    RETURNING version, generated_at, routes, policies, integrity, is_active
    `,
    [
      snapshot.version,
      snapshot.generated_at,
      JSON.stringify(snapshot.routes),
      JSON.stringify(snapshot.policies),
      JSON.stringify(snapshot.integrity),
      snapshot.is_active ?? false,
    ],
  );

  return mapSnapshotRow(result.rows[0]!);
}

export async function listSnapshots(): Promise<Snapshot[]> {
  const result = await pool.query<SnapshotRow>(
    `
    SELECT version, generated_at, routes, policies, integrity, is_active
    FROM snapshots
    ORDER BY version DESC
    `,
  );

  return result.rows.map(mapSnapshotRow);
}

export async function getLatestSnapshot(): Promise<Snapshot | null> {
  const result = await pool.query<SnapshotRow>(
    `
    SELECT version, generated_at, routes, policies, integrity, is_active
    FROM snapshots
    ORDER BY version DESC
    LIMIT 1
    `,
  );

  const row = result.rows[0];

  return row ? mapSnapshotRow(row) : null;
}

export async function getActiveSnapshot(): Promise<Snapshot | null> {
  const result = await pool.query<SnapshotRow>(
    `
    SELECT version, generated_at, routes, policies, integrity, is_active
    FROM snapshots
    WHERE is_active = TRUE
    ORDER BY version DESC
    LIMIT 1
    `,
  );

  const row = result.rows[0];

  return row ? mapSnapshotRow(row) : null;
}

export async function getSnapshotByVersion(
  version: number,
): Promise<Snapshot | null> {
  const result = await pool.query<SnapshotRow>(
    `
    SELECT version, generated_at, routes, policies, integrity, is_active
    FROM snapshots
    WHERE version = $1
    LIMIT 1
    `,
    [version],
  );

  const row = result.rows[0];

  return row ? mapSnapshotRow(row) : null;
}

export async function getNextSnapshotVersion(): Promise<number> {
  const result = await pool.query<{ next_version: number }>(
    `
    SELECT COALESCE(MAX(version), 0) + 1 AS next_version
    FROM snapshots
    `,
  );

  return result.rows[0]?.next_version ?? 1;
}

export async function activateSnapshot(version: number): Promise<void> {
  await pool.query(`UPDATE snapshots SET is_active = FALSE WHERE is_active = TRUE`);
  await pool.query(`UPDATE snapshots SET is_active = TRUE WHERE version = $1`, [
    version,
  ]);
}