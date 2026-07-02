import { apiRequest } from "@/lib/api-request";
import type {
  ApplyCampaignPayload,
  AvailableCampaign,
  AvailableCampaignsQuery,
  CampaignApiSuccessResponse,
  CampaignApplicationsQuery,
  CreatorApplication,
  PaginatedResponse,
} from "@/types/campaign";
import type {
  ContentSubmissionQuery,
  CreatorContentSubmission,
} from "@/types/content-submission";
import type { CreatorPerformanceResponse } from "@/types/performance";
import type {
  CreatorTrackingLink,
  TrackingLinkQuery,
} from "@/types/tracking-link";

async function request<T>(path: string, token: string, options: RequestInit = {}) {
  const payload = await apiRequest<T>(path, { ...options, token });
  return payload;
}

function buildQueryString(params: Record<string, string | number | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === "") {
      continue;
    }

    searchParams.set(key, String(value));
  }

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : "";
}

function normalizePaginatedResult<T>(
  payload: CampaignApiSuccessResponse<T[]>,
): PaginatedResponse<T> {
  return {
    data: payload.data,
    meta: payload.meta ?? null,
  };
}

export async function getAvailableCampaigns(
  token: string,
  params: AvailableCampaignsQuery = {},
) {
  const queryString = buildQueryString({
    search: params.search,
    page: params.page,
    limit: params.limit,
    objective: params.objective,
  });

  const payload = await request<AvailableCampaign[]>(
    `/creator/campaigns/available${queryString}`,
    token,
  );

  return normalizePaginatedResult(payload);
}

export async function getCreatorCampaignDetails(token: string, campaignId: string) {
  const payload = await request<AvailableCampaign>(
    `/creator/campaigns/${campaignId}`,
    token,
  );

  return payload.data;
}

export async function applyToCampaign(
  token: string,
  campaignId: string,
  payload: ApplyCampaignPayload,
) {
  const response = await request<{ application: CreatorApplication }>(
    `/creator/campaigns/${campaignId}/apply`,
    token,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return response.data;
}

export async function getMyApplications(
  token: string,
  params: CampaignApplicationsQuery = {},
) {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    status: params.status,
  });

  const payload = await request<CreatorApplication[]>(
    `/creator/applications${queryString}`,
    token,
  );

  return normalizePaginatedResult(payload);
}

export async function withdrawApplication(token: string, applicationId: string) {
  const payload = await request<CreatorApplication>(
    `/creator/applications/${applicationId}/withdraw`,
    token,
    {
      method: "PATCH",
    },
  );

  return payload.data;
}

export async function getMyContentSubmissions(
  token: string,
  params: ContentSubmissionQuery = {},
) {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    status: params.status,
    search: params.search,
  });

  const payload = await request<CreatorContentSubmission[]>(
    `/creator/content-submissions${queryString}`,
    token,
  );

  return normalizePaginatedResult(payload);
}

export async function getMyTrackingLinks(
  token: string,
  params: TrackingLinkQuery = {},
) {
  const queryString = buildQueryString({
    page: params.page,
    limit: params.limit,
    status: params.status,
    search: params.search,
  });

  const payload = await request<CreatorTrackingLink[]>(
    `/creator/tracking-links${queryString}`,
    token,
  );

  return normalizePaginatedResult(payload);
}

export async function getMyPerformance(token: string) {
  const payload = await request<CreatorPerformanceResponse>(
    "/creator/performance",
    token,
  );

  return payload.data;
}
