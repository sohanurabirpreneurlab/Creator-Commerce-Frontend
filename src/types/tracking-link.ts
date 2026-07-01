import type { CampaignObjective, PaginationMeta } from "@/types/campaign";

export type TrackingLinkStatus =
  | "ACTIVE"
  | "INACTIVE"
  | "DEACTIVATED"
  | "EXPIRED";

export interface TrackingLinkCampaignSummary {
  id: string;
  title: string;
  objective: CampaignObjective;
}

export interface TrackingLinkBrandSummary {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface CreatorTrackingLink {
  id: string;
  campaignId: string;
  creatorProfileId: string;
  campaignCreatorId: string | null;
  brandId: string;
  shortCode: string;
  trackingUrl: string;
  destinationUrl: string;
  status: TrackingLinkStatus;
  generatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  campaign: TrackingLinkCampaignSummary;
  brand: TrackingLinkBrandSummary;
}

export interface TrackingLinkQuery {
  page?: number;
  limit?: number;
  status?: TrackingLinkStatus;
  search?: string;
}

export interface TrackingLinkListResponse {
  data: CreatorTrackingLink[];
  meta: PaginationMeta | null;
}
