"use client";

import { ReactNode, useEffect } from "react";
import { useRealtimeEventStore } from "@/src/core/state/realtime-event-store";
import {
  startDomainEventStream,
  stopDomainEventStream,
} from '../../modules/realtime/domain-event-stream';
import {
  notifyInfo,
  notifySuccess,
  notifyWarning,
} from '../../modules/notifications/domain-notifications';

type RealtimeEventsProviderProps = {
  children: ReactNode;
};

function getControlPlaneBaseUrl(): string {
  return process.env.NEXT_PUBLIC_CONTROL_PLANE_BASE_URL ?? "http://localhost:3001";
}

function notifyFromEvent(eventName: string, resourceId: string): void {
  if (eventName === "snapshot.rollback_completed") {
    notifyWarning("Realtime event", `Rollback completed for ${resourceId}.`);
    return;
  }

  if (eventName.startsWith("snapshot.")) {
    notifySuccess("Realtime event", `${eventName} for ${resourceId}.`);
    return;
  }

  notifyInfo("Realtime event", `${eventName} for ${resourceId}.`);
}

export function RealtimeEventsProvider({ children }: RealtimeEventsProviderProps) {
  const setConnected = useRealtimeEventStore((state) => state.setConnected);
  const pushEvent = useRealtimeEventStore((state) => state.pushEvent);

  useEffect(() => {
    startDomainEventStream({
      baseUrl: getControlPlaneBaseUrl(),
      onEvent: (event) => {
        setConnected(true);
        pushEvent(event);
        notifyFromEvent(event.name, event.payload.resource_id);
      },
      onError: () => {
        setConnected(false);
      },
    });

    return () => {
      stopDomainEventStream();
      setConnected(false);
    };
  }, [pushEvent, setConnected]);

  return <>{children}</>;
}