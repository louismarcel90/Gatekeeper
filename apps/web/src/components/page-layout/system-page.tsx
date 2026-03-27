import { ReactNode } from "react";
import { PageContainer } from "./page-container";
import { PageStack } from "./page-stack";
import { DegradedModeBanner } from "@/src/components/feedback/degraded-mode-banner";
import { SystemHealthBar } from "@/src/components/feedback/system-health-bar";

export function SystemPage({ children }: { children: ReactNode }) {
  return (
    <PageContainer>
      <PageStack>
        <DegradedModeBanner />
        <SystemHealthBar />
        {children}
      </PageStack>
    </PageContainer>
  );
}