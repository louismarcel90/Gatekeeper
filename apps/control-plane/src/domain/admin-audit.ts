export type AdminAuditAction =
  | "route.created"
  | "route.updated"
  | "route.lifecycle_changed"
  | "policy.created"
  | "policy.updated"
  | "snapshot.published"
  | "snapshot.activated"
  | "snapshot.rollback_completed"
  | "admin_user.created";

export type AdminAuditMetadata = Record<string, string | number | boolean | null>;

export type AdminAuditEvent = {
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