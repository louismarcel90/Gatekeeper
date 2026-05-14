"use client";

import { ProtectedRoute } from "@/src/components/auth/protected-route";
import { AppShell } from "@/src/components/app-shell/app-shell";
export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}
