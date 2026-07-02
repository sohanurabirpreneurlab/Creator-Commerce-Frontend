import { useMemo, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useNotifications } from "@/hooks/use-notifications";
import { Button } from "@/components/ui/button";
import type { NotificationItem } from "@/types/notification";
import { cn } from "@/lib/utils";

function formatTime(value: string) {
  const diffMs = Date.now() - new Date(value).getTime();
  const diffMinutes = Math.max(1, Math.round(diffMs / 60000));

  if (diffMinutes < 60) {
    return `${diffMinutes}m ago`;
  }

  const diffHours = Math.round(diffMinutes / 60);
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }

  return new Date(value).toLocaleDateString();
}

export function NotificationBell() {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const latestNotifications = useMemo(() => notifications, [notifications]);

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      await markAsRead(notification.id);
    }

    setIsOpen(false);
    navigate(notification.actionUrl || "/dashboard/notifications");
  };

  return (
    <div className="relative z-[90]">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-white text-foreground shadow-sm transition-colors hover:bg-slate-50"
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-full z-[120] mt-3 grid h-[min(26rem,calc(100vh-8rem))] w-[min(18.5rem,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.18)] md:w-[19.5rem] lg:w-[20.5rem]">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <p className="text-sm font-bold text-foreground">Notifications</p>
              <p className="text-xs text-muted">{unreadCount} unread</p>
            </div>
            <button
              type="button"
              onClick={() => void markAllAsRead()}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-foreground"
              aria-label="Mark all as read"
            >
              <CheckCheck className="h-4 w-4" />
            </button>
          </div>

          <div className="min-h-0 overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-6 text-sm text-muted">Loading notifications...</p>
            ) : latestNotifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted">No notifications yet.</p>
            ) : (
              latestNotifications.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => void handleNotificationClick(notification)}
                  className="grid w-full gap-1 border-b border-slate-100 px-4 py-3 text-left transition-colors hover:bg-slate-50"
                >
                  <div className="flex items-start gap-2">
                    <span
                      className={cn(
                        "mt-1 h-2 w-2 rounded-full",
                        notification.isRead ? "bg-slate-200" : "bg-sky-500",
                      )}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">
                        {notification.title}
                      </p>
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-[11px] font-medium uppercase text-slate-400">
                        {formatTime(notification.createdAt)}
                      </p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>

          <div className="border-t border-slate-100 p-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                setIsOpen(false);
                navigate("/dashboard/notifications");
              }}
            >
              View all
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
