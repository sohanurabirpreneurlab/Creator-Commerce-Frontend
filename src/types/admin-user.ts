import type { PaginationMeta } from "@/types/campaign";
import type { UserRole } from "@/types/auth";

export type AdminUserStatus = "ACTIVE" | "SUSPENDED" | "DISABLED";

export interface AdminUserSummary {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AdminUserStatus;
  createdAt: string;
  updatedAt: string;
  relatedProfileSummary: {
    creatorProfileId: string | null;
    brandManagerId: string | null;
    brandId: string | null;
  };
}

export interface RoleBreakdownItem {
  role: UserRole;
  count: number;
}

export interface UserQuery {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  status?: AdminUserStatus;
}

export interface UpdateUserRolePayload {
  role: UserRole;
}

export interface UpdateUserStatusPayload {
  status: AdminUserStatus;
}

export interface AdminUserListResponse {
  data: AdminUserSummary[];
  meta: PaginationMeta | null;
}
