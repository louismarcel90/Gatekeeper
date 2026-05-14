import { useNotificationStore } from "@/src/core/state/notification-store";

export function notifySuccess(title: string, message: string): void {
  useNotificationStore.getState().pushNotification({
    tone: "success",
    title,
    message,
  });
}

export function notifyInfo(title: string, message: string): void {
  useNotificationStore.getState().pushNotification({
    tone: "info",
    title,
    message,
  });
}

export function notifyWarning(title: string, message: string): void {
  useNotificationStore.getState().pushNotification({
    tone: "warning",
    title,
    message,
  });
}

export function notifyError(title: string, message: string): void {
  useNotificationStore.getState().pushNotification({
    tone: "error",
    title,
    message,
  });
}
