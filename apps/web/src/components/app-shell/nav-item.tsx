"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavItem({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "10px 12px",
        borderRadius: 12,
        textDecoration: "none",
        color: isActive ? "#111111" : "#44403C",
        background: isActive ? "#EEF2FF" : "transparent",
        border: isActive ? "1px solid #DDE5FF" : "1px solid transparent",
        fontWeight: isActive ? 600 : 500,
        transition: "all 140ms ease",
      }}
    >
      {label}
    </Link>
  );
}