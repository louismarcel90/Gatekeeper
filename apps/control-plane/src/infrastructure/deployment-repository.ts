import { randomUUID } from "crypto";
import { pool } from "../db/client";
import { DeploymentHistoryEntry } from "../domain/types";

type DeploymentHistoryRow = {
  id: string;
  snapshot_version: number;
  action: "PUBLISH" | "ACTIVATE" | "ROLLBACK";
  created_at: string;
};

export async function insertDeploymentHistoryEntry(params: {
  snapshot_version: number;
  action: "PUBLISH" | "ACTIVATE" | "ROLLBACK";
}): Promise<DeploymentHistoryEntry> {
  const id = randomUUID();

  const result = await pool.query<DeploymentHistoryRow>(
    `
    INSERT INTO deployment_history (id, snapshot_version, action)
    VALUES ($1, $2, $3)
    RETURNING id, snapshot_version, action, created_at
    `,
    [id, params.snapshot_version, params.action],
  );

  const row = result.rows[0]!;

  return {
    id: row.id,
    snapshot_version: row.snapshot_version,
    action: row.action,
    created_at: row.created_at,
  };
}

export async function listDeploymentHistory(): Promise<DeploymentHistoryEntry[]> {
  const result = await pool.query<DeploymentHistoryRow>(`
    SELECT id, snapshot_version, action, created_at
    FROM deployment_history
    ORDER BY created_at DESC
    LIMIT 100
  `);

  return result.rows.map((row) => ({
    id: row.id,
    snapshot_version: row.snapshot_version,
    action: row.action,
    created_at: row.created_at,
  }));
}