import { createContext } from "react";
import type { NotificationItem } from "@/types/notification";

export type NotificationContextValue = {
  notifications: NotificationItem[];
  unreadCount: number;
  isLoading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<NotificationItem | null>;
  markAllAsRead: () => Promise<void>;
};

export const NotificationContext =
  createContext<NotificationContextValue | null>(null);
