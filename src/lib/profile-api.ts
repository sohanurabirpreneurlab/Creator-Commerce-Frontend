import { env } from "@/config/env";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  ProfileResponse,
  UpdateProfilePayload,
} from "@/types/profile";

async function request<T>(
  path: string,
  token: string,
  options: RequestInit = {},
) {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = (await response.json()) as
    | ApiSuccessResponse<T>
    | ApiErrorResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload.data;
}

export function getMyProfile(token: string) {
  return request<ProfileResponse>("/profile", token, {
    method: "GET",
  });
}

export function updateMyProfile(token: string, payload: UpdateProfilePayload) {
  return request<ProfileResponse>("/profile", token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
