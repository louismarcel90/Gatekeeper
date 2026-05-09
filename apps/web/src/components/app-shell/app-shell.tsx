import { ReactNode } from "react";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { NotificationCenter } from "../feedback/notification-center";
import { RealtimeEventsProvider } from "../realtime/realtime-events-provider";

export function AppShell({ children }: { children: ReactNode }) {
  return (
  <RealtimeEventsProvider>
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "stretch",
        background: "#F7F7F5",
        overflow: "hidden",
      }}
    >
      <Sidebar />

      <div
        style={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Topbar />

        <main
          style={{
            flex: 1,
            minWidth: 0,
            overflowX: "hidden",
            overflowY: "auto",
            padding: "24px",
          }}
        >
          {children}
        </main>
      </div>

      <NotificationCenter />
    </div>
  </RealtimeEventsProvider>
);
}
