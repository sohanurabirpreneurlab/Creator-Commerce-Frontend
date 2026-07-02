import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { NotificationContext } from "@/contexts/notification-context";
import { useAuth } from "@/hooks/use-auth";
import {
  getNotifications,
  getUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/notification-api";
import { connectNotificationSocket } from "@/lib/socket";
import type { NotificationItem } from "@/types/notification";

const notificationToneUrl = "/tone/notification.wav";

function upsertNotification(
  notifications: NotificationItem[],
  nextNotification: NotificationItem,
) {
  const withoutDuplicate = notifications.filter(
    (notification) => notification.id !== nextNotification.id,
  );

  return [nextNotification, ...withoutDuplicate].slice(0, 20);
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [popupNotifications, setPopupNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const popupTimeoutIds = useRef<number[]>([]);

  const refreshNotifications = useCallback(async () => {
    if (!token) {
      // Logout clears local notification state immediately; the socket cleanup
      // below also disconnects because it depends on the same token.
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    setIsLoading(true);

    try {
      const [notificationResult, unreadTotal] = await Promise.all([
        getNotifications(token, { page: 1, limit: 20 }),
        getUnreadCount(token),
      ]);

      setNotifications(notificationResult.data);
      setUnreadCount(unreadTotal);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void refreshNotifications();
  }, [refreshNotifications]);

  useEffect(() => {
    audioRef.current = new Audio(notificationToneUrl);
    audioRef.current.preload = "auto";

    return () => {
      popupTimeoutIds.current.forEach((timeoutId) => window.clearTimeout(timeoutId));
      popupTimeoutIds.current = [];
    };
  }, []);

  const playNotificationTone = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.currentTime = 0;
    void audio.play().catch(() => {
      // Browsers can block audio until the user interacts with the page. The
      // popup still appears, and the next interacted session can play normally.
    });
  }, []);

  const dismissPopup = useCallback((notificationId: string) => {
    setPopupNotifications((currentNotifications) =>
      currentNotifications.filter((notification) => notification.id !== notificationId),
    );
  }, []);

  useEffect(() => {
    if (!token) {
      return;
    }

    // Socket.IO receives the same JWT used by the REST API. The backend
    // authenticates it and joins a private user room before sending events.
    const socket = connectNotificationSocket(token);

    socket.on("notification:new", (notification: NotificationItem) => {
      // Keep a small latest-notifications cache for the bell. The full page
      // still fetches from the API so it stays authoritative and paginatable.
      setNotifications((currentNotifications) =>
        upsertNotification(currentNotifications, notification),
      );
      setPopupNotifications((currentNotifications) =>
        upsertNotification(currentNotifications, notification).slice(0, 3),
      );
      setUnreadCount((currentCount) => currentCount + (notification.isRead ? 0 : 1));
      playNotificationTone();

      const timeoutId = window.setTimeout(() => {
        dismissPopup(notification.id);
      }, 6500);
      popupTimeoutIds.current.push(timeoutId);
    });

    socket.on(
      "notification:unread-count",
      (payload: { unreadCount: number }) => {
        setUnreadCount(payload.unreadCount);
      },
    );

    return () => {
      socket.disconnect();
    };
  }, [dismissPopup, playNotificationTone, token]);

  const markAsRead = useCallback(
    async (notificationId: string) => {
      if (!token) {
        return null;
      }

      const updatedNotification = await markNotificationAsRead(
        token,
        notificationId,
      );

      // Update local state optimistically after the backend confirms ownership
      // and read_at. The server also emits unread-count for other open tabs.
      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) =>
          notification.id === notificationId ? updatedNotification : notification,
        ),
      );
      setUnreadCount((currentCount) => Math.max(0, currentCount - 1));
      return updatedNotification;
    },
    [token],
  );

  const markAllAsRead = useCallback(async () => {
    if (!token) {
      return;
    }

    await markAllNotificationsAsRead(token);
    setNotifications((currentNotifications) =>
      currentNotifications.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: notification.readAt ?? new Date().toISOString(),
      })),
    );
    setUnreadCount(0);
  }, [token]);

  const handlePopupClick = useCallback(
    async (notification: NotificationItem) => {
      if (!notification.isRead) {
        await markAsRead(notification.id);
      }

      dismissPopup(notification.id);
      navigate(notification.actionUrl || "/dashboard/notifications");
    },
    [dismissPopup, markAsRead, navigate],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      isLoading,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
    }),
    [
      notifications,
      unreadCount,
      isLoading,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
    ],
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[70] grid w-[min(380px,calc(100vw-2rem))] gap-3">
        {popupNotifications.map((notification) => (
          <div
            key={notification.id}
            className="pointer-events-auto relative animate-notification-slide-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-hero"
          >
            <button
              type="button"
              onClick={() => void handlePopupClick(notification)}
              className="grid w-full gap-1 p-4 text-left transition-colors hover:bg-slate-50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-foreground">
                    {notification.title}
                  </p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                    {notification.message}
                  </p>
                </div>
                <span className="rounded-full bg-sky-50 px-2 py-1 text-[10px] font-bold uppercase text-sky-700">
                  New
                </span>
              </div>
            </button>
            <button
              type="button"
              onClick={() => dismissPopup(notification.id)}
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-100 hover:text-foreground"
              aria-label="Dismiss notification"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
