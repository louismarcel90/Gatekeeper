import { randomUUID } from "crypto";
import { pool } from "../db/client";
import {
  CreateDecisionAuditLogInput,
  DecisionAuditQueryInput,
} from "../domain/validators";
import { DecisionAuditLog } from "../domain/types";

type DecisionAuditLogRow = {
  id: string;
  decision_id: string;
  decision: "ALLOW" | "DENY" | "THROTTLE";
  reason_code: string;
  route_id: string | null;
  policy_id: string | null;
  client_id: string | null;
  path: string;
  method: string;
  ip: string;
  matched_rule: string | null;
  explanation: string;
  snapshot_version: number | null;
  created_at: string;
};

function mapRow(row: DecisionAuditLogRow): DecisionAuditLog {
  return {
    id: row.id,
    decision_id: row.decision_id,
    decision: row.decision,
    reason_code: row.reason_code,
    route_id: row.route_id,
    policy_id: row.policy_id,
    client_id: row.client_id,
    path: row.path,
    method: row.method,
    ip: row.ip,
    matched_rule: row.matched_rule,
    explanation: row.explanation,
    snapshot_version: row.snapshot_version,
    created_at: row.created_at,
  };
}

export async function insertDecisionAuditLog(
  input: CreateDecisionAuditLogInput,
): Promise<DecisionAuditLog> {
  const id = randomUUID();

  const result = await pool.query<DecisionAuditLogRow>(
    `
    INSERT INTO decision_audit_logs (
      id,
      decision_id,
      decision,
      reason_code,
      route_id,
      policy_id,
      client_id,
      path,
      method,
      ip,
      matched_rule,
      explanation,
      snapshot_version
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
    RETURNING
      id,
      decision_id,
      decision,
      reason_code,
      route_id,
      policy_id,
      client_id,
      path,
      method,
      ip,
      matched_rule,
      explanation,
      snapshot_version,
      created_at
    `,
    [
      id,
      input.decision_id,
      input.decision,
      input.reason_code,
      input.route_id,
      input.policy_id,
      input.client_id,
      input.path,
      input.method,
      input.ip,
      input.matched_rule,
      input.explanation,
      input.snapshot_version,
    ],
  );

  return mapRow(result.rows[0]!);
}

export async function listDecisionAuditLogs(
  filters: DecisionAuditQueryInput,
): Promise<DecisionAuditLog[]> {
  const conditions: string[] = [];
  const values: Array<string | number> = [];
  let index = 1;

  if (filters.decision) {
    conditions.push(`decision = $${index++}`);
    values.push(filters.decision);
  }

  if (filters.reason_code) {
    conditions.push(`reason_code = $${index++}`);
    values.push(filters.reason_code);
  }

  if (filters.client_id) {
    conditions.push(`client_id = $${index++}`);
    values.push(filters.client_id);
  }

  if (filters.route_id) {
    conditions.push(`route_id = $${index++}`);
    values.push(filters.route_id);
  }

  if (filters.policy_id) {
    conditions.push(`policy_id = $${index++}`);
    values.push(filters.policy_id);
  }

  if (filters.path) {
    conditions.push(`path = $${index++}`);
    values.push(filters.path);
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
    SELECT
      id,
      decision_id,
      decision,
      reason_code,
      route_id,
      policy_id,
      client_id,
      path,
      method,
      ip,
      matched_rule,
      explanation,
      snapshot_version,
      created_at
    FROM decision_audit_logs
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ${limitPlaceholder}
    OFFSET ${offsetPlaceholder}
  `;

  const result = await pool.query<DecisionAuditLogRow>(query, values);
  return result.rows.map(mapRow);
}

export async function getDecisionAuditLogByDecisionId(
  decisionId: string,
): Promise<DecisionAuditLog | null> {
  const result = await pool.query<DecisionAuditLogRow>(
    `
    SELECT
      id,
      decision_id,
      decision,
      reason_code,
      route_id,
      policy_id,
      client_id,
      path,
      method,
      ip,
      matched_rule,
      explanation,
      snapshot_version,
      created_at
    FROM decision_audit_logs
    WHERE decision_id = $1
    LIMIT 1
    `,
    [decisionId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  return mapRow(result.rows[0]!);
}