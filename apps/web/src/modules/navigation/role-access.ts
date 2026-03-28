import { AdminRole } from "../auth/types";
import { NAV_ITEMS } from "./nav-config";

export function getVisibleNavItems(role: AdminRole | undefined) {
  if (!role) {
    return [];
  }

  return NAV_ITEMS.filter((item) => item.roles.includes(role));
}
