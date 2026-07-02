import { apiRequest } from "@/lib/api-request";
import type {
  NotificationItem,
  NotificationPreferences,
  NotificationQueryParams,
  UpdateNotificationPreferencesPayload,
} from "@/types/notification";

function buildQueryString(params: NotificationQueryParams = {}) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

function normalizePaginatedResult<T>(payload: {
  data: T[];
  meta?: { page: number; limit: number; total: number; totalPages: number };
}) {
  return {
    data: payload.data,
    meta: payload.meta ?? null,
  };
}

export async function getNotifications(
  token: string,
  params: NotificationQueryParams = {},
) {
  const payload = await apiRequest<NotificationItem[]>(
    `/notifications${buildQueryString(params)}`,
    { token },
  );

  return normalizePaginatedResult(payload);
}

export async function getUnreadCount(token: string) {
  const payload = await apiRequest<{ unreadCount: number }>(
    "/notifications/unread-count",
    { token },
  );

  return payload.data.unreadCount;
}

export async function markNotificationAsRead(
  token: string,
  notificationId: string,
) {
  const payload = await apiRequest<NotificationItem>(
    `/notifications/${notificationId}/read`,
    {
      token,
      method: "PATCH",
    },
  );

  return payload.data;
}

export async function markAllNotificationsAsRead(token: string) {
  const payload = await apiRequest<{ updatedCount: number }>(
    "/notifications/read-all",
    {
      token,
      method: "PATCH",
    },
  );

  return payload.data;
}

export async function getNotificationPreferences(token: string) {
  const payload = await apiRequest<NotificationPreferences>(
    "/notification-preferences",
    { token },
  );

  return payload.data;
}

export async function updateNotificationPreferences(
  token: string,
  payload: UpdateNotificationPreferencesPayload,
) {
  const response = await apiRequest<NotificationPreferences>(
    "/notification-preferences",
    {
      token,
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}
