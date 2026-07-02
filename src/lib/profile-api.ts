import { apiRequest } from "@/lib/api-request";
import {
  ProfileResponse,
  UpdateProfilePayload,
} from "@/types/profile";

async function request<T>(
  path: string,
  token: string,
  options: RequestInit = {},
) {
  const payload = await apiRequest<T>(path, { ...options, token });
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
