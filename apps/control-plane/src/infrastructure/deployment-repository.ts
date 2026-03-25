import { randomUUID } from "crypto";
import { pool } from "../db/client";
import { DeploymentHistoryEntry } from "../domain/types";
import { DeploymentHistoryQueryInput } from "../domain/validators";

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

export async function listDeploymentHistory(
  filters: DeploymentHistoryQueryInput,
): Promise<DeploymentHistoryEntry[]> {
  const conditions: string[] = [];
  const values: Array<string | number> = [];
  let index = 1;

  if (filters.action) {
    conditions.push(`action = $${index++}`);
    values.push(filters.action);
  }

  if (filters.snapshot_version !== undefined) {
    conditions.push(`snapshot_version = $${index++}`);
    values.push(filters.snapshot_version);
  }

  const whereClause =
    conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const limitPlaceholder = `$${index++}`;
  const offsetPlaceholder = `$${index++}`;
  values.push(filters.limit, filters.offset);

  const query = `
    SELECT id, snapshot_version, action, created_at
    FROM deployment_history
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ${limitPlaceholder}
    OFFSET ${offsetPlaceholder}
  `;

  const result = await pool.query<DeploymentHistoryRow>(query, values);

  return result.rows.map((row) => ({
    id: row.id,
    snapshot_version: row.snapshot_version,
    action: row.action,
    created_at: row.created_at,
  }));
}