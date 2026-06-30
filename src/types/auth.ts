export type UserRole = "CREATOR" | "BRAND_MANAGER" | "SUPER_ADMIN";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mobileNumber: string;
  address: string;
  gender: string;
  dateOfBirth: string;
  createdAt: string;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: Record<string, unknown>;
  };
}

export interface LoginPayload {
  identifier: string;
  password: string;
}

export interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  mobileNumber: string;
  address: string;
  gender: string;
  dateOfBirth: string;
}
