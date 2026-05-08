"use client";

import { create } from "zustand";

export type NotificationTone = "success" | "info" | "warning" | "error";

export type AppNotification = {
  id: string;
  tone: NotificationTone;
  title: string;
  message: string;
  createdAt: string;
};

type NotificationState = {
  notifications: AppNotification[];
  pushNotification: (input: {
    tone: NotificationTone;
    title: string;
    message: string;
  }) => void;
  dismissNotification: (id: string) => void;
  clearNotifications: () => void;
};

function createNotificationId(): string {
  return crypto.randomUUID();
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],

  pushNotification: (input) =>
    set((state) => ({
      notifications: [
        {
          id: createNotificationId(),
          tone: input.tone,
          title: input.title,
          message: input.message,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ].slice(0, 8),
    })),

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter(
        (notification) => notification.id !== id,
      ),
    })),

  clearNotifications: () =>
    set({
      notifications: [],
    }),
}));