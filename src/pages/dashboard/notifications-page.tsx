import { useEffect, useMemo, useState } from "react";
import { CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
import { TableLoadingState } from "@/components/dashboard/table-loading-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/hooks/use-notifications";
import { getNotifications } from "@/lib/notification-api";
import type {
  NotificationCategory,
  NotificationItem,
} from "@/types/notification";
import { cn } from "@/lib/utils";

const FILTERS: Array<"ALL" | "UNREAD" | NotificationCategory> = [
  "ALL",
  "UNREAD",
  "CAMPAIGN",
  "APPLICATION",
  "CONTENT",
  "TRACKING_LINK",
  "SYSTEM",
];

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function NotificationsPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { markAsRead, markAllAsRead, refreshNotifications } = useNotifications();
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("ALL");
  const [isLoading, setIsLoading] = useState(true);

  const queryParams = useMemo(() => {
    if (filter === "UNREAD") {
      return { page: 1, limit: 100, isRead: false };
    }

    if (filter !== "ALL") {
      return { page: 1, limit: 100, category: filter };
    }

    return { page: 1, limit: 100 };
  }, [filter]);

  useEffect(() => {
    if (!token) {
      return;
    }

    let isActive = true;
    setIsLoading(true);

    getNotifications(token, queryParams)
      .then((response) => {
        if (isActive) {
          setItems(response.data);
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [token, queryParams]);

  const handleClick = async (notification: NotificationItem) => {
    if (!notification.isRead) {
      const updatedNotification = await markAsRead(notification.id);
      if (updatedNotification) {
        setItems((currentItems) =>
          currentItems.map((item) =>
            item.id === notification.id ? updatedNotification : item,
          ),
        );
      }
    }

    navigate(notification.actionUrl || "/dashboard/notifications");
  };

  const handleMarkAll = async () => {
    await markAllAsRead();
    await refreshNotifications();
    setItems((currentItems) =>
      currentItems.map((item) => ({
        ...item,
        isRead: true,
        readAt: item.readAt ?? new Date().toISOString(),
      })),
    );
  };

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Notifications
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Review campaign, application, content, tracking, and system updates.
            </p>
          </div>
          <Button type="button" variant="outline" className="gap-2" onClick={() => void handleMarkAll()}>
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((nextFilter) => (
            <button
              key={nextFilter}
              type="button"
              onClick={() => setFilter(nextFilter)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                filter === nextFilter
                  ? "border-primary bg-primary text-white"
                  : "border-slate-200 bg-white text-slate-600 hover:border-primary",
              )}
            >
              {nextFilter === "ALL" ? "All" : nextFilter.replaceAll("_", " ")}
            </button>
          ))}
        </div>
      </Card>

      {isLoading ? (
        <TableLoadingState message="Loading notifications..." />
      ) : items.length === 0 ? (
        <DataTableEmptyState
          title="No notifications found"
          description="New updates will appear here as your workflows move forward."
        />
      ) : (
        <Card className="divide-y divide-slate-100 overflow-hidden">
          {items.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => void handleClick(notification)}
              className="grid w-full gap-2 px-6 py-5 text-left transition-colors hover:bg-slate-50"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 gap-3">
                  <span
                    className={cn(
                      "mt-2 h-2.5 w-2.5 rounded-full",
                      notification.isRead ? "bg-slate-200" : "bg-sky-500",
                    )}
                  />
                  <div className="min-w-0">
                    <p className="font-bold text-foreground">{notification.title}</p>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {notification.message}
                    </p>
                    <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {notification.category.replaceAll("_", " ")} / {notification.priority}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-xs text-muted">
                  {formatDate(notification.createdAt)}
                </p>
              </div>
            </button>
          ))}
        </Card>
      )}
    </div>
  );
}
