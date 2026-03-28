"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

type NavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 12,
        textDecoration: "none",
        fontSize: 14,
        fontWeight: 500,
        color: isActive ? "#111111" : "#6B665F",
        background: isActive ? "#EEF2FF" : "transparent",
        transition: "all 0.15s ease",
      }}
    >
      <Icon
        size={18}
        strokeWidth={2}
        style={{
          color: isActive ? "#4F46E5" : "#6B665F",
          flexShrink: 0,
        }}
      />

      <span>{label}</span>
    </Link>
  );
}