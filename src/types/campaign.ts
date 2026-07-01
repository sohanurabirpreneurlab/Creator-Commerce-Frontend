import type { ApiErrorResponse } from "@/types/auth";

export type CampaignObjective =
  | "CLICK"
  | "LEAD"
  | "REGISTRATION"
  | "PURCHASE"
  | "RECHARGE"
  | "APP_INSTALL";

export type CampaignStatus =
  | "DRAFT"
  | "PENDING_APPROVAL"
  | "ACTIVE"
  | "PAUSED"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED";

export type CampaignApplicationStatus =
  | "APPLIED"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN";

export type ProposedContentType =
  | "SHORT_VIDEO"
  | "LONG_VIDEO"
  | "STATIC_POST"
  | "STORY"
  | "REEL"
  | "LIVE"
  | "OTHER";

export type SocialPlatform =
  | "FACEBOOK"
  | "INSTAGRAM"
  | "TIKTOK"
  | "YOUTUBE"
  | "LINKEDIN"
  | "OTHER";

export interface CampaignBrandSummary {
  id: string;
  name: string;
  industry: string | null;
  website?: string | null;
  contactEmail?: string | null;
  logoUrl: string | null;
}

export interface ManagedCampaign {
  id: string;
  brandId: string;
  title: string;
  description: string | null;
  objective: CampaignObjective;
  status: CampaignStatus;
  budget: number;
  destinationUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  createdBy: string | null;
  approvedBy: string | null;
  approvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  brand: CampaignBrandSummary;
}

export interface CampaignApplicationSummary {
  id: string;
  status: CampaignApplicationStatus;
}

export interface AvailableCampaign {
  id: string;
  title: string;
  description: string | null;
  objective: CampaignObjective;
  status: CampaignStatus;
  budget: number;
  destinationUrl: string | null;
  startDate: string | null;
  endDate: string | null;
  brandId: string;
  brand: CampaignBrandSummary;
  application: CampaignApplicationSummary | null;
  hasApplied: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApplyCampaignPayload {
  message: string;
  proposedContentType?: ProposedContentType;
  primaryPlatform?: SocialPlatform;
  expectedPostDate?: string;
}

export interface CreatorApplication {
  id: string;
  campaignId: string;
  creatorProfileId: string;
  status: CampaignApplicationStatus;
  message: string | null;
  proposedContentType: ProposedContentType | null;
  primaryPlatform: SocialPlatform | null;
  expectedPostDate: string | null;
  appliedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  campaign: {
    id: string;
    title: string;
    objective: CampaignObjective;
    status: CampaignStatus;
    startDate: string | null;
    endDate: string | null;
  };
  brand: {
    id: string;
    name: string;
    logoUrl: string | null;
  };
}

export interface ReviewerApplication {
  id: string;
  campaignId: string;
  creatorProfileId: string;
  status: CampaignApplicationStatus;
  message: string | null;
  proposedContentType: ProposedContentType | null;
  primaryPlatform: SocialPlatform | null;
  expectedPostDate: string | null;
  appliedAt: string;
  reviewedAt: string | null;
  reviewedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  campaign: {
    id: string;
    title: string;
    objective: CampaignObjective;
    status: CampaignStatus;
    startDate: string | null;
    endDate: string | null;
  };
  brand: {
    id: string;
    name: string;
    logoUrl: string | null;
  };
  creator: {
    id: string;
    displayName: string;
    category: string | null;
    location: string | null;
    userEmail: string;
  };
}

export interface AvailableCampaignsQuery {
  search?: string;
  page?: number;
  limit?: number;
  objective?: CampaignObjective;
}

export interface CampaignApplicationsQuery {
  page?: number;
  limit?: number;
  status?: CampaignApplicationStatus;
  search?: string;
}

export interface ManagedCampaignsQuery {
  page?: number;
  limit?: number;
  status?: CampaignStatus;
  objective?: CampaignObjective;
  search?: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta | null;
}

export interface CampaignApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export type CampaignApiErrorResponse = ApiErrorResponse;
