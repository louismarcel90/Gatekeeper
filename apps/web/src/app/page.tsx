"use client";

import { ProtectedRoute } from "../components/auth/protected-route"; 
import { useRoutes } from "../modules/routes/use-routes";
import { useAuthStore } from "../core/state/auth-store";

type RouteItem = {
  id: string;
  method: string;
  path: string;
  enabled: boolean;
};

function DashboardContent() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const { data, isLoading, isError } = useRoutes();

  if (isLoading) {
    return <div style={{ padding: 24 }}>Loading routes...</div>;
  }

  if (isError) {
    return <div style={{ padding: 24 }}>Error loading routes.</div>;
  }

  return (
    <div style={{ padding: 24, display: "grid", gap: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Gatekeeper Dashboard</h1>
          <div>
            Signed in as {user?.email} ({user?.role})
          </div>
        </div>

        <button
          onClick={logout}
          style={{ padding: "10px 14px", borderRadius: 8, cursor: "pointer" }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {(data as RouteItem[]).map((route) => (
          <div
            key={route.id}
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 12,
            }}
          >
            <strong>{route.method}</strong> {route.path} —{" "}
            {route.enabled ? "enabled" : "disabled"}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}