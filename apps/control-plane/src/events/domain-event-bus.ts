import { DomainEvent, DomainEventName, DomainEventPayload } from "./domain-event";

type DomainEventHandler = (event: DomainEvent) => Promise<void>;

const handlers: DomainEventHandler[] = [];

export function subscribeToDomainEvents(handler: DomainEventHandler): void {
  handlers.push(handler);
}

export async function publishDomainEvent(input: {
  name: DomainEventName;
  payload: DomainEventPayload;
}): Promise<DomainEvent> {
  const event: DomainEvent = {
    id: crypto.randomUUID(),
    name: input.name,
    payload: input.payload,
    occurred_at: new Date().toISOString(),
  };

  await Promise.all(handlers.map((handler) => handler(event)));

  return event;
}