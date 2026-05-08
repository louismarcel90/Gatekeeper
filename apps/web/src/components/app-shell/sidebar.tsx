"use client";

import type { ComponentType } from "react";
import {
  LayoutDashboard,
  Route,
  ShieldCheck,
  FlaskConical,
  Layers,
  FileSearch,
  FileText,
  Rocket,
  UserStar,
  GitCompareArrows,
} from "lucide-react";

import { useAuthStore } from "@/src/core/state/auth-store";
import { getVisibleNavItems } from "@/src/modules/navigation/role-access";
import { NavItem } from "./nav-item";
// import { GatekeeperMark } from "../icons/gatekeeper-mark";

type NavLabel =
  | "Dashboard"
  | "Routes"
  | "Policies"
  | "Simulation"
  | "Snapshots"
  | "Audit Log"
  | "Policy Documents"
  | "Deployments"
  | "Admin Users"
  | "Snapshot Diff"

type IconType = ComponentType<{ className?: string }>;

const navIcons: Record<NavLabel, IconType> = {
  Dashboard: LayoutDashboard,
  Routes: Route,
  Policies: ShieldCheck,
  Simulation: FlaskConical,
  Snapshots: Layers,
  "Audit Log": FileSearch,
  "Policy Documents": FileText,
  Deployments: Rocket,
  "Admin Users": UserStar,
  "Snapshot Diff": GitCompareArrows,
};

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
          {/* <GatekeeperMark /> */}
          <span>Gatekeeper</span>
        </div>

        <nav
          style={{
            display: "grid",
            gap: 6,
          }}
        >
          {items.map((item) => {
            const Icon = navIcons[item.label as NavLabel] ?? LayoutDashboard;

            return <NavItem key={item.href} href={item.href} label={item.label} icon={Icon} />;
          })}
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
          <div
            style={{
              fontSize: 12,
              color: "#78716C",
            }}
          >
            Signed in as
          </div>

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
