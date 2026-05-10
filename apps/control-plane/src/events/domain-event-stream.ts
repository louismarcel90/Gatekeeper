import { DomainEvent } from "./domain-event";

type EventStreamClient = {
  id: string;
  send: (event: DomainEvent) => void;
};

const clients: EventStreamClient[] = [];

export function registerEventStreamClient(client: EventStreamClient): void {
  clients.push(client);
}

export function unregisterEventStreamClient(clientId: string): void {
  const index = clients.findIndex((client) => client.id === clientId);

  if (index >= 0) {
    clients.splice(index, 1);
  }
}

export function broadcastDomainEvent(event: DomainEvent): void {
  for (const client of clients) {
    client.send(event);
  }
}
