import {
  AdminAuditAction,
  AdminAuditMetadata,
} from "../domain/admin-audit";
import {
  createAdminAuditEvent,
  listAdminAuditEvents,
} from "../infrastructure/admin-audit-repository";

export async function recordAdminAuditEvent(input: {
  action: AdminAuditAction;
  resource_type: string;
  resource_id: string;
  actor_user_id: string | null;
  actor_email: string | null;
  request_id: string | null;
  metadata?: AdminAuditMetadata;
}) {
  return createAdminAuditEvent({
    action: input.action,
    resource_type: input.resource_type,
    resource_id: input.resource_id,
    actor_user_id: input.actor_user_id,
    actor_email: input.actor_email,
    request_id: input.request_id,
    metadata: input.metadata ?? {},
  });
}

export async function getAdminAuditEvents() {
  return listAdminAuditEvents();
}