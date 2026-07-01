import type { CampaignObjective, PaginationMeta, SocialPlatform } from "@/types/campaign";

export type ContentSubmissionStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "APPROVED"
  | "CHANGE_REQUESTED"
  | "REJECTED";

export interface ContentSubmissionCampaignSummary {
  id: string;
  title: string;
  objective: CampaignObjective;
}

export interface ContentSubmissionBrandSummary {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface ContentSubmissionCreatorSummary {
  id: string;
  displayName: string;
  category: string | null;
  location: string | null;
  userEmail: string;
}

export interface CreatorContentSubmission {
  id: string;
  campaignId: string;
  creatorProfileId: string;
  campaignCreatorId: string | null;
  platform: SocialPlatform | null;
  caption: string | null;
  contentUrl: string | null;
  status: ContentSubmissionStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewedBy: string | null;
  reviewComment: string | null;
  createdAt: string;
  updatedAt: string;
  campaign: ContentSubmissionCampaignSummary;
  brand: ContentSubmissionBrandSummary;
}

export interface ReviewerContentSubmission extends CreatorContentSubmission {
  creator: ContentSubmissionCreatorSummary;
}

export interface ContentSubmissionQuery {
  page?: number;
  limit?: number;
  status?: ContentSubmissionStatus;
  search?: string;
}

export interface ReviewContentSubmissionPayload {
  reviewComment?: string;
}

export interface UpdateContentSubmissionStatusPayload {
  status: ContentSubmissionStatus;
  reviewComment?: string;
}

export interface ContentSubmissionListResponse {
  data: CreatorContentSubmission[];
  meta: PaginationMeta | null;
}
