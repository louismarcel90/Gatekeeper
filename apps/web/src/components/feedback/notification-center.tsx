"use client";

import { useNotificationStore } from "@/src/core/state/notification-store";

function getToneStyles(tone: "success" | "info" | "warning" | "error") {
  if (tone === "success") {
    return {
      border: "#BFE8D4",
      background: "#F1FBF6",
      accent: "#168A4A",
    };
  }

  if (tone === "warning") {
    return {
      border: "#E8D1A8",
      background: "#FFF9EF",
      accent: "#9A6A2C",
    };
  }

  if (tone === "error") {
    return {
      border: "#F2B8B5",
      background: "#FFF7F7",
      accent: "#B54848",
    };
  }

  return {
    border: "#D8D2FF",
    background: "#F7F5FF",
    accent: "#5B55D6",
  };
}

export function NotificationCenter() {
  const notifications = useNotificationStore((state) => state.notifications);
  const dismissNotification = useNotificationStore(
    (state) => state.dismissNotification,
  );
  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications,
  );

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        right: 24,
        bottom: 24,
        width: 360,
        maxWidth: "calc(100vw - 48px)",
        display: "grid",
        gap: 10,
        zIndex: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          type="button"
          onClick={clearNotifications}
          style={{
            border: "1px solid #E7E5E4",
            background: "#FFFFFF",
            borderRadius: 999,
            padding: "6px 10px",
            fontSize: 12,
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      {notifications.map((notification) => {
        const styles = getToneStyles(notification.tone);

        return (
          <div
            key={notification.id}
            style={{
              border: `1px solid ${styles.border}`,
              background: styles.background,
              borderRadius: 16,
              padding: 14,
              boxShadow: "0 18px 40px rgba(17, 17, 17, 0.08)",
              display: "grid",
              gap: 6,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: styles.accent,
                }}
              >
                {notification.title}
              </div>

              <button
                type="button"
                onClick={() => dismissNotification(notification.id)}
                style={{
                  border: 0,
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: 16,
                  lineHeight: 1,
                  color: "#78716C",
                }}
                aria-label="Dismiss notification"
              >
                ×
              </button>
            </div>

            <div
              style={{
                fontSize: 13,
                lineHeight: 1.5,
                color: "#44403C",
              }}
            >
              {notification.message}
            </div>
          </div>
        );
      })}
    </div>
  );
}