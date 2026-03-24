import { randomUUID } from "crypto";
import { pool } from "../db/client";
import { CreateDecisionAuditLogInput } from "../domain/validators";
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

  const row = result.rows[0]!;

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

export async function listDecisionAuditLogs(): Promise<DecisionAuditLog[]> {
  const result = await pool.query<DecisionAuditLogRow>(`
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
    ORDER BY created_at DESC
    LIMIT 100
  `);

  return result.rows.map((row) => ({
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
  }));
}