"use client";

import { useEffect } from "react";
import { useFrontendHealthStore } from "@/src/core/state/frontend-health-store";

function getControlPlaneBaseUrl(): string {
  return process.env.NEXT_PUBLIC_CONTROL_PLANE_BASE_URL ?? "http://localhost:3001";
}

async function checkControlPlaneHealth(): Promise<boolean> {
  const response = await fetch(`${getControlPlaneBaseUrl()}/health`, {
    method: "GET",
    cache: "no-store",
  });

  return response.ok;
}

export function ControlPlaneHealthProbe() {
  const setDependencyStatus = useFrontendHealthStore((state) => state.setDependencyStatus);

  useEffect(() => {
    let cancelled = false;

    async function runCheck() {
      try {
        const healthy = await checkControlPlaneHealth();

        if (cancelled) {
          return;
        }

        setDependencyStatus({
          name: "control-plane",
          status: healthy ? "healthy" : "degraded",
          reason: healthy
            ? "Control Plane health check succeeded."
            : "Control Plane health check returned a non-OK response.",
        });
      } catch {
        if (cancelled) {
          return;
        }

        setDependencyStatus({
          name: "control-plane",
          status: "unavailable",
          reason: "Control Plane is unreachable from the frontend.",
        });
      }
    }

    void runCheck();

    const intervalId = window.setInterval(() => {
      void runCheck();
    }, 10000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [setDependencyStatus]);

  return null;
}
