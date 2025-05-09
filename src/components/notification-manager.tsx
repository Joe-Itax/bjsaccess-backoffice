"use client";
import { Notification } from "./notification";
import { useNotification } from "@/hooks/use-notification";

export function NotificationManager() {
  const { type, message, clear } = useNotification();

  if (!type || !message) return null;

  return <Notification type={type} message={message} onClose={clear} />;
}
