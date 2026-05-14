import { QueryClient } from "@tanstack/react-query";
import { RealtimeDomainEvent } from "./domain-event-stream";

type ReconciliationDecision = {
  shouldAccept: boolean;
  reason: string;
};

const processedEventIds = new Set<string>();

function parseTimestamp(value: string): number {
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
}

export function shouldAcceptRealtimeEvent(event: RealtimeDomainEvent): ReconciliationDecision {
  if (processedEventIds.has(event.id)) {
    return {
      shouldAccept: false,
      reason: "duplicate_event",
    };
  }

  const eventTime = parseTimestamp(event.occurred_at);

  if (eventTime === 0) {
    return {
      shouldAccept: false,
      reason: "invalid_timestamp",
    };
  }

  processedEventIds.add(event.id);

  if (processedEventIds.size > 500) {
    processedEventIds.clear();
  }

  return {
    shouldAccept: true,
    reason: "accepted",
  };
}

export async function reconcileQueryCacheFromEvent(params: {
  queryClient: QueryClient;
  event: RealtimeDomainEvent;
}): Promise<void> {
  const { queryClient, event } = params;

  if (event.name.startsWith("route.")) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["routes"] }),
      queryClient.invalidateQueries({ queryKey: ["policy-document", "export"] }),
      queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
    ]);
    return;
  }

  if (event.name.startsWith("policy.")) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["policies"] }),
      queryClient.invalidateQueries({ queryKey: ["policy-document", "export"] }),
      queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
    ]);
    return;
  }

  if (event.name.startsWith("snapshot.")) {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["snapshots"] }),
      queryClient.invalidateQueries({ queryKey: ["deployments"] }),
      queryClient.invalidateQueries({ queryKey: ["policy-document", "export"] }),
    ]);
  }
}
