export type DomainEventName =
  | "route.created"
  | "route.updated"
  | "route.lifecycle_changed"
  | "policy.created"
  | "policy.updated"
  | "snapshot.published"
  | "snapshot.activated"
  | "snapshot.rollback_completed";

export type DomainEventPayload = {
  resource_id: string;
  resource_type: string;
  action: string;
  actor_email?: string;
  request_id?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

export type DomainEvent = {
  id: string;
  name: DomainEventName;
  payload: DomainEventPayload;
  occurred_at: string;
};
