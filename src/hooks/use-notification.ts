"use client";

import { create } from "zustand";

type NotificationType = "success" | "error" | "info" | "note";

interface NotificationState {
  type: NotificationType | null;
  message: string | null;
  show: (type: NotificationType, message: string) => void;
  clear: () => void;
}

export const useNotification = create<NotificationState>((set) => ({
  type: null,
  message: null,
  show: (type, message) => set({ type, message }),
  clear: () => set({ type: null, message: null }),
}));
