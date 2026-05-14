"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, MouseEvent } from "react";

type IconType = ComponentType<{ className?: string }>;

type NavItemProps = {
  href: string;
  label: string;
  icon: IconType;
};

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  // ✅ Handlers bien définis (clean, testable, maintenable)
  function handleMouseEnter(e: MouseEvent<HTMLAnchorElement>) {
    if (!isActive) {
      e.currentTarget.style.background = "#F7F7F5";
    }
  }

  function handleMouseLeave(e: MouseEvent<HTMLAnchorElement>) {
    if (!isActive) {
      e.currentTarget.style.background = "transparent";
    }
  }

  return (
    <Link
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 12,
        textDecoration: "none",
        fontSize: 14,
        fontWeight: 500,
        color: isActive ? "#111111" : "#6B665E",
        background: isActive ? "#EEF2FF" : "transparent",
        transition: "all 0.15s ease",
      }}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
}
