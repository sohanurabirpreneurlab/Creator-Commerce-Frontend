import { env } from "@/config/env";
import {
  ApiErrorResponse,
  ApiSuccessResponse,
  AuthResult,
  LoginPayload,
  SignUpPayload,
} from "@/types/auth";

async function request<T>(path: string, options: RequestInit) {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
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

export function signUp(payload: SignUpPayload) {
  return request<AuthResult>("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return request<AuthResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
