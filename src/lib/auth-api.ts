import { apiRequest } from "@/lib/api-request";
import {
  AuthResult,
  LoginPayload,
  SignUpPayload,
} from "@/types/auth";

async function request<T>(path: string, options: RequestInit) {
  const payload = await apiRequest<T>(path, options);
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
