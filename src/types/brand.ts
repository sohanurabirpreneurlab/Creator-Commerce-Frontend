import type { PaginationMeta } from "@/types/campaign";

export type BrandStatus = "PENDING" | "ACTIVE" | "SUSPENDED" | "REJECTED";

export interface Brand {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  logoUrl: string | null;
  contactEmail: string | null;
  status: BrandStatus;
  createdBy: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrandQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: BrandStatus;
}

export interface CreateBrandPayload {
  name: string;
  industry?: string;
  website?: string;
  logoUrl?: string;
  contactEmail?: string;
}

export interface UpdateBrandPayload extends CreateBrandPayload {}

export interface UpdateBrandStatusPayload {
  status: BrandStatus;
}

export interface BrandListResponse {
  data: Brand[];
  meta: PaginationMeta | null;
}
