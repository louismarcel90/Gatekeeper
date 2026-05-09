export type RealtimeDomainEvent = {
  id: string;
  name: string;
  occurred_at: string;
  payload: {
    resource_id: string;
    resource_type: string;
    action: string;
    actor_email?: string;
    request_id?: string;
    metadata?: Record<string, string | number | boolean | null>;
  };
};

type DomainEventHandler = (event: RealtimeDomainEvent) => void;

let eventSource: EventSource | null = null;

export function startDomainEventStream(params: {
  baseUrl: string;
  onEvent: DomainEventHandler;
  onError: () => void;
}): void {
  if (eventSource) {
    return;
  }

  eventSource = new EventSource(`${params.baseUrl}/events/stream`);

  eventSource.onmessage = (message) => {
    try {
      const parsed = JSON.parse(message.data) as { type?: string };

      if (parsed.type === "connected") {
        return;
      }
    } catch {
      return;
    }
  };

  const eventNames = [
    "route.created",
    "route.updated",
    "route.lifecycle_changed",
    "policy.created",
    "policy.updated",
    "snapshot.published",
    "snapshot.activated",
    "snapshot.rollback_completed",
  ];

  for (const eventName of eventNames) {
    eventSource.addEventListener(eventName, (message) => {
      const parsed = JSON.parse(message.data) as RealtimeDomainEvent;
      params.onEvent(parsed);
    });
  }

  eventSource.onerror = () => {
    params.onError();
  };
}

export function stopDomainEventStream(): void {
  eventSource?.close();
  eventSource = null;
}