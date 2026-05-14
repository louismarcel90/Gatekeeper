import { recordAdminAuditEvent } from "../application/admin-audit-service";
import { DomainEvent } from "./domain-event";
import { subscribeToDomainEvents } from "./domain-event-bus";

function logDomainEvent(event: DomainEvent): void {
  console.log(
    JSON.stringify({
      timestamp: new Date().toISOString(),
      service: "gatekeeper-control-plane",
      level: "INFO",
      message: "Domain event published.",
      event_id: event.id,
      event_name: event.name,
      resource_id: event.payload.resource_id,
      resource_type: event.payload.resource_type,
      action: event.payload.action,
      actor_email: event.payload.actor_email ?? null,
      request_id: event.payload.request_id ?? null,
      metadata: event.payload.metadata ?? null,
    }),
  );
}

export function registerDomainEventLogger(): void {
  subscribeToDomainEvents(async (event) => {
    logDomainEvent(event);

    await recordAdminAuditEvent({
      action: event.name,
      resource_type: event.payload.resource_type,
      resource_id: event.payload.resource_id,
      actor_user_id: null,
      actor_email: event.payload.actor_email ?? null,
      request_id: event.payload.request_id ?? null,
      metadata: {
        domain_event_id: event.id,
        domain_action: event.payload.action,
        ...(event.payload.metadata ?? {}),
      },
    });
  });
}
