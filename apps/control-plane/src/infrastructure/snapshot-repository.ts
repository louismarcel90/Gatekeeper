import { pool } from "../db/client";
import { Snapshot } from "../domain/types";

type SnapshotRow = {
  version: number;
  generated_at: string;
  routes: Snapshot["routes"];
  policies: Snapshot["policies"];
};

export async function insertSnapshot(snapshot: Snapshot): Promise<Snapshot> {
  await pool.query(
    `
    INSERT INTO snapshots (version, generated_at, routes, policies)
    VALUES ($1, $2, $3::jsonb, $4::jsonb)
    `,
    [
      snapshot.version,
      snapshot.generated_at,
      JSON.stringify(snapshot.routes),
      JSON.stringify(snapshot.policies),
    ],
  );

  return snapshot;
}

export async function getLatestSnapshot(): Promise<Snapshot | null> {
  const result = await pool.query<SnapshotRow>(`
    SELECT version, generated_at, routes, policies
    FROM snapshots
    ORDER BY version DESC
    LIMIT 1
  `);

 const row = result.rows[0];

if (!row) {
  return null;
}

return {
  version: row.version,
  generated_at: row.generated_at,
  routes: row.routes,
  policies: row.policies,
};
}

export async function getNextSnapshotVersion(): Promise<number> {
  const result = await pool.query<{ next_version: number }>(`
    SELECT COALESCE(MAX(version), 0) + 1 AS next_version
    FROM snapshots
  `);

  return result.rows[0]?.next_version ?? 1;
}