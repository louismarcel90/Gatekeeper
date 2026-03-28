"use client";

import { useAuthStore } from "@/src/core/state/auth-store";

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header
      style={{
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: "0 20px",
        borderBottom: "1px solid #E7E5E4",
        background: "#FBFBFA",
        minWidth: 0,
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 12px",
          borderRadius: 999,
          border: "1px solid #E7E5E4",
          background: "#FFFFFF",
          color: "#111111",
          fontWeight: 600,
          fontSize: 14,
          flexShrink: 0,
        }}
      >
        Control Plane
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          minWidth: 0,
        }}
      >
        <div
          style={{
            color: "#57534E",
            fontSize: 14,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: 220,
          }}
        >
          {user?.email}
        </div>

        <button
          onClick={logout}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            border: "1px solid #E7E5E4",
            background: "#FFFFFF",
            color: "#111111",
            cursor: "pointer",
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}
