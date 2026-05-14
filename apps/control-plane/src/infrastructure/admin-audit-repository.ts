import { randomUUID } from "node:crypto";
import { pool } from "../db/client";
import { AdminAuditAction, AdminAuditEvent, AdminAuditMetadata } from "../domain/admin-audit";

type AdminAuditEventRow = {
  id: string;
  action: AdminAuditAction;
  resource_type: string;
  resource_id: string;
  actor_user_id: string | null;
  actor_email: string | null;
  request_id: string | null;
  metadata: AdminAuditMetadata;
  created_at: string;
};

function mapRow(row: AdminAuditEventRow): AdminAuditEvent {
  return {
    id: row.id,
    action: row.action,
    resource_type: row.resource_type,
    resource_id: row.resource_id,
    actor_user_id: row.actor_user_id,
    actor_email: row.actor_email,
    request_id: row.request_id,
    metadata: row.metadata,
    created_at: row.created_at,
  };
}

export async function createAdminAuditEvent(input: {
  action: AdminAuditAction;
  resource_type: string;
  resource_id: string;
  actor_user_id: string | null;
  actor_email: string | null;
  request_id: string | null;
  metadata: AdminAuditMetadata;
}): Promise<AdminAuditEvent> {
  const result = await pool.query<AdminAuditEventRow>(
    `
    INSERT INTO admin_audit_events (
      id,
      action,
      resource_type,
      resource_id,
      actor_user_id,
      actor_email,
      request_id,
      metadata
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING
      id,
      action,
      resource_type,
      resource_id,
      actor_user_id,
      actor_email,
      request_id,
      metadata,
      created_at
    `,
    [
      randomUUID(),
      input.action,
      input.resource_type,
      input.resource_id,
      input.actor_user_id,
      input.actor_email,
      input.request_id,
      JSON.stringify(input.metadata),
    ],
  );

  return mapRow(result.rows[0]!);
}

export async function listAdminAuditEvents(): Promise<AdminAuditEvent[]> {
  const result = await pool.query<AdminAuditEventRow>(
    `
    SELECT
      id,
      action,
      resource_type,
      resource_id,
      actor_user_id,
      actor_email,
      request_id,
      metadata,
      created_at
    FROM admin_audit_events
    ORDER BY created_at DESC
    LIMIT 200
    `,
  );

  return result.rows.map(mapRow);
}
