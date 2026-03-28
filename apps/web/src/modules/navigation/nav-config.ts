import { AdminRole } from "@/src/modules/auth/types";

export type NavItemConfig = {
  label: string;
  href: string;
  roles: AdminRole[];
};

export const NAV_ITEMS: NavItemConfig[] = [
  {
    label: "Dashboard",
    href: "/",
    roles: ["viewer", "security", "admin"],
  },
  {
    label: "Routes",
    href: "/routes",
    roles: ["viewer", "security", "admin"],
  },
  {
    label: "Policies",
    href: "/policies",
    roles: ["viewer", "security", "admin"],
  },
  {
    label: "Simulation",
    href: "/simulation",
    roles: ["viewer", "security", "admin"],
  },
  {
    label: "Snapshots",
    href: "/snapshots",
    roles: ["viewer", "security", "admin"],
  },
  {
    label: "Audit Log",
    href: "/audit",
    roles: ["viewer", "security", "admin"],
  },
  {
    label: "Policy Documents",
    href: "/policy-documents",
    roles: ["viewer", "security", "admin"],
  },
  {
    label: "Deployments",
    href: "/deployments",
    roles: ["viewer", "security", "admin"],
  },
  {
    label: "Admin Users",
    href: "/admin-users",
    roles: ["admin"],
  },
];
