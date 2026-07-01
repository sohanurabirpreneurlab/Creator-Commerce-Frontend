import type { PaginationMeta } from "@/types/campaign";

export type CreatorVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface CreatorListItem {
  id: string;
  userId: string;
  displayName: string;
  bio: string | null;
  category: string | null;
  location: string | null;
  profileImageUrl: string | null;
  verificationStatus: CreatorVerificationStatus;
  userEmail: string;
  socialAccountsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreatorQuery {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  verificationStatus?: CreatorVerificationStatus;
}

export interface UpdateCreatorVerificationPayload {
  verificationStatus: CreatorVerificationStatus;
}

export interface CreatorListResponse {
  data: CreatorListItem[];
  meta: PaginationMeta | null;
}
