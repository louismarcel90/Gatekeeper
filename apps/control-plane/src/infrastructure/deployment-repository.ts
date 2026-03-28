import { randomUUID } from "crypto";
import { pool } from "../db/client";
import { DeploymentHistoryEntry } from "../domain/types";
import { DeploymentHistoryQueryInput } from "../domain/validators";

type DeploymentHistoryRow = {
  id: string;
  snapshot_version: number;
  action: "PUBLISH" | "ACTIVATE" | "ROLLBACK";
  request_id: string | null;
  actor_user_id: string | null;
  actor_email: string | null;
  created_at: string;
};

export async function insertDeploymentHistoryEntry(params: {
  snapshot_version: number;
  action: "PUBLISH" | "ACTIVATE" | "ROLLBACK";
  request_id?: string | null;
  actor_user_id?: string | null;
  actor_email?: string | null;
}): Promise<DeploymentHistoryEntry> {
  const id = randomUUID();

  const result = await pool.query<DeploymentHistoryRow>(
    `
    INSERT INTO deployment_history (
      id,
      snapshot_version,
      action,
      request_id,
      actor_user_id,
      actor_email
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, snapshot_version, action, request_id, actor_user_id, actor_email, created_at
    `,
    [
      id,
      params.snapshot_version,
      params.action,
      params.request_id ?? null,
      params.actor_user_id ?? null,
      params.actor_email ?? null,
    ],
  );

  const row = result.rows[0]!;

  return {
    id: row.id,
    snapshot_version: row.snapshot_version,
    action: row.action,
    request_id: row.request_id,
    actor_user_id: row.actor_user_id,
    actor_email: row.actor_email,
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

  if (filters.request_id) {
    conditions.push(`request_id = $${index++}`);
    values.push(filters.request_id);
  }

  if (filters.actor_email) {
    conditions.push(`actor_email = $${index++}`);
    values.push(filters.actor_email);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  const limitPlaceholder = `$${index++}`;
  const offsetPlaceholder = `$${index++}`;
  values.push(filters.limit, filters.offset);

  const query = `
    SELECT id, snapshot_version, action, request_id, actor_user_id, actor_email, created_at
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
    request_id: row.request_id,
    actor_user_id: row.actor_user_id,
    actor_email: row.actor_email,
    created_at: row.created_at,
  }));
}
