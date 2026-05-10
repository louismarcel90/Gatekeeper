"use client";

import { ReactNode, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useRealtimeEventStore } from "@/src/core/state/realtime-event-store"; 
import { useFrontendHealthStore } from "@/src/core/state/frontend-health-store";
import {
  startDomainEventStream,
  stopDomainEventStream,
} from "../../modules/realtime/domain-event-stream";
import {
  notifyInfo,
  notifySuccess,
  notifyWarning,
} from "../../modules/notifications/domain-notifications";
import {
  reconcileQueryCacheFromEvent,
  shouldAcceptRealtimeEvent,
} from "../../modules/realtime/realtime-reconciliation";

type RealtimeEventsProviderProps = {
  children: ReactNode;
};

function getControlPlaneBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_CONTROL_PLANE_BASE_URL ?? "http://localhost:3001"
  );
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

export function RealtimeEventsProvider({
  children,
}: RealtimeEventsProviderProps) {
  const queryClient = useQueryClient();

  const setConnectionState = useRealtimeEventStore(
    (state) => state.setConnectionState,
  );

  const pushEvent = useRealtimeEventStore((state) => state.pushEvent);

  const setRejectedEventReason = useRealtimeEventStore(
    (state) => state.setRejectedEventReason,
  );

  const setDependencyStatus = useFrontendHealthStore(
    (state) => state.setDependencyStatus,
  );

  useEffect(() => {
    setConnectionState("reconnecting");

    startDomainEventStream({
      baseUrl: getControlPlaneBaseUrl(),

      onEvent: (event) => {
        const decision = shouldAcceptRealtimeEvent(event);

        if (!decision.shouldAccept) {
          setRejectedEventReason(decision.reason);
          return;
        }

        setConnectionState("connected");

        setDependencyStatus({
          name: "realtime-stream",
          status: "healthy",
          reason: "Realtime stream is receiving events.",
        });

        setRejectedEventReason(null);
        pushEvent(event);

        void reconcileQueryCacheFromEvent({
          queryClient,
          event,
        });

        notifyFromEvent(event.name, event.payload.resource_id);
      },

      onError: () => {
        setConnectionState("reconnecting");

        setDependencyStatus({
          name: "realtime-stream",
          status: "degraded",
          reason: "Realtime stream connection failed or is reconnecting.",
        });
      },
    });

    return () => {
      stopDomainEventStream();

      setDependencyStatus({
        name: "realtime-stream",
        status: "degraded",
        reason: "Realtime stream disconnected.",
      });
    };
  }, [
    pushEvent,
    queryClient,
    setConnectionState,
    setDependencyStatus,
    setRejectedEventReason,
  ]);

  return <>{children}</>;
}