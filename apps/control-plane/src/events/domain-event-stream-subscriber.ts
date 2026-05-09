import { subscribeToDomainEvents } from "./domain-event-bus";
import { broadcastDomainEvent } from "./domain-event-stream";

export function registerDomainEventStreamSubscriber(): void {
  subscribeToDomainEvents(async (event) => {
    broadcastDomainEvent(event);
  });
}