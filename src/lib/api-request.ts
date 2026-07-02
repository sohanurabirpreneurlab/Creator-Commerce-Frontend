import { env } from "@/config/env";
import { showBackendError } from "@/lib/backend-error-events";
import type { PaginationMeta } from "@/types/campaign";

export type ApiSuccessPayload<T> = {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
};

type ApiErrorPayload = {
  success: false;
  message?: string;
  error?: {
    message?: string;
    code?: string;
    details?: unknown;
  };
};

type ApiRequestOptions = RequestInit & {
  token?: string;
};

function getPayloadMessage(payload: ApiErrorPayload) {
  return payload.message || payload.error?.message || "Request failed.";
}

function notifyAndThrow(message: string): never {
  showBackendError(message);
  throw new Error(message);
}

export async function apiRequest<T>(
  path: string,
  { token, headers, ...options }: ApiRequestOptions = {},
) {
  let response: Response;

  try {
    response = await fetch(`${env.apiBaseUrl}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(headers ?? {}),
      },
      ...options,
    });
  } catch {
    notifyAndThrow("Unable to reach the backend. Please try again.");
  }

  let payload: ApiSuccessPayload<T> | ApiErrorPayload | null = null;

  try {
    payload = (await response.json()) as ApiSuccessPayload<T> | ApiErrorPayload;
  } catch {
    const message = response.ok
      ? "The backend returned an unreadable response."
      : `Request failed with status ${response.status}.`;
    notifyAndThrow(message);
  }

  if (!response.ok) {
    notifyAndThrow(
      payload.success
        ? payload.message || `Request failed with status ${response.status}.`
        : getPayloadMessage(payload),
    );
  }

  if (!payload.success) {
    notifyAndThrow(getPayloadMessage(payload));
  }

  return payload;
}
