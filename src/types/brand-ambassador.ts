import type { PaginationMeta } from "@/types/campaign";

export type BrandAmbassadorStatus =
  | "PENDING"
  | "ACTIVE"
  | "PAUSED"
  | "REMOVED"
  | "REJECTED";

export type BrandAmbassadorType =
  | "LONG_TERM"
  | "CAMPAIGN_BASED"
  | "EVENT_BASED"
  | "PRODUCT_BASED";

export type BrandAmbassadorSource =
  | "INVITED_BY_BRAND"
  | "ADDED_BY_SUPERADMIN"
  | "CREATOR_REQUESTED"
  | "ADDED_BY_BRAND";

export interface BrandAmbassador {
  id: string;
  brandId: string;
  creatorProfileId: string;
  status: BrandAmbassadorStatus;
  ambassadorType: BrandAmbassadorType;
  source: BrandAmbassadorSource;
  assignedBy: string | null;
  joinedAt: string;
  removedAt: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  brand: {
    id: string;
    name: string;
  };
  creator: {
    id: string;
    displayName: string;
    category: string | null;
    location: string | null;
    userEmail: string;
  };
}

export interface BrandAmbassadorQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: BrandAmbassadorStatus;
}

export interface CreateBrandAmbassadorPayload {
  creatorProfileId: string;
  ambassadorType?: BrandAmbassadorType;
  source?: BrandAmbassadorSource;
  notes?: string;
}

export interface UpdateBrandAmbassadorPayload {
  ambassadorType?: BrandAmbassadorType;
  notes?: string;
}

export interface UpdateBrandAmbassadorStatusPayload {
  status: BrandAmbassadorStatus;
}

export interface BrandAmbassadorListResponse {
  data: BrandAmbassador[];
  meta: PaginationMeta | null;
}
