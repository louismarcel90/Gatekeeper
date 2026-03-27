"use client";

import { useAuthStore } from "@/src/core/state/auth-store";
import { getVisibleNavItems } from "@/src/modules/navigation/role-access";
import { NavItem } from "./nav-item";

export function Sidebar() {
  const user = useAuthStore((state) => state.user);
  const items = getVisibleNavItems(user?.role);

  return (
    <aside
      style={{
        width: 272,
        minWidth: 272,
        maxWidth: 272,
        borderRight: "1px solid #E7E5E4",
        background: "#FBFBFA",
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          display: "flex",
          flexDirection: "column",
          gap: 20,
          minHeight: "calc(100vh - 40px)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 18,
            fontWeight: 700,
            color: "#111111",
            letterSpacing: "-0.02em",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 14,
              background: "linear-gradient(180deg, #8FA7FF, #6C83F7)",
              flexShrink: 0,
            }}
          />
          <span>Gatekeeper</span>
        </div>

        <nav
          style={{
            display: "grid",
            gap: 6,
          }}
        >
          {items.map((item) => (
            <NavItem key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div
          style={{
            marginTop: "auto",
            padding: 14,
            borderRadius: 16,
            background: "#FFFFFF",
            border: "1px solid #ECE8E5",
            display: "grid",
            gap: 6,
            overflow: "hidden",
          }}
        >
          <div style={{ fontSize: 12, color: "#78716C" }}>Signed in as</div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "#111111",
              lineHeight: 1.4,
              overflowWrap: "anywhere",
              wordBreak: "break-word",
            }}
          >
            {user?.email}
          </div>

          <div
            style={{
              fontSize: 12,
              color: user?.role === "admin" ? "#9A6A2C" : "#5F5B53",
              textTransform: "capitalize",
              fontWeight: 600,
            }}
          >
            {user?.role}
          </div>
        </div>
      </div>
    </aside>
  );
}