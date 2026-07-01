import { env } from "@/config/env";
import type {
  BrandAmbassador,
  BrandAmbassadorQuery,
  CreateBrandAmbassadorPayload,
  UpdateBrandAmbassadorPayload,
  UpdateBrandAmbassadorStatusPayload,
} from "@/types/brand-ambassador";
import type { BrandAnalyticsResponse } from "@/types/analytics";
import type {
  CampaignApiErrorResponse,
  CampaignApiSuccessResponse,
  CampaignApplicationsQuery,
  ManagedCampaign,
  ManagedCampaignsQuery,
  ReviewerApplication,
} from "@/types/campaign";
import type {
  ContentSubmissionQuery,
  ReviewContentSubmissionPayload,
  ReviewerContentSubmission,
} from "@/types/content-submission";

type PaginatedResult<T> = {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
};

async function request<T>(path: string, token: string, options: RequestInit = {}) {
  const response = await fetch(`${env.apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers ?? {}),
    },
    ...options,
  });

  const payload = (await response.json()) as
    | CampaignApiSuccessResponse<T>
    | CampaignApiErrorResponse;

  if (!response.ok || !payload.success) {
    throw new Error(payload.message || "Request failed.");
  }

  return payload;
}

function buildQueryString(params: object) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params as Record<string, unknown>)) {
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
): PaginatedResult<T> {
  return {
    data: payload.data,
    meta: payload.meta ?? null,
  };
}

export async function getBrandCampaigns(
  token: string,
  params: ManagedCampaignsQuery = {},
) {
  const queryString = buildQueryString(params);
  const payload = await request<ManagedCampaign[]>(
    `/brand/campaigns${queryString}`,
    token,
  );
  return normalizePaginatedResult(payload);
}

export async function createBrandCampaign(
  token: string,
  payload: Partial<ManagedCampaign>,
) {
  const response = await request<ManagedCampaign>("/brand/campaigns", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateBrandCampaign(
  token: string,
  campaignId: string,
  payload: Partial<ManagedCampaign>,
) {
  const response = await request<ManagedCampaign>(
    `/brand/campaigns/${campaignId}`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function updateBrandCampaignStatus(
  token: string,
  campaignId: string,
  payload: { status: ManagedCampaign["status"] },
) {
  const response = await request<ManagedCampaign>(
    `/brand/campaigns/${campaignId}/status`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function getBrandAmbassadors(
  token: string,
  params: BrandAmbassadorQuery = {},
) {
  const payload = await request<BrandAmbassador[]>(
    `/brand/ambassadors${buildQueryString(params)}`,
    token,
  );
  return normalizePaginatedResult(payload);
}

export async function createBrandAmbassador(
  token: string,
  payload: CreateBrandAmbassadorPayload,
) {
  const response = await request<BrandAmbassador>("/brand/ambassadors", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateBrandAmbassador(
  token: string,
  ambassadorId: string,
  payload: UpdateBrandAmbassadorPayload,
) {
  const response = await request<BrandAmbassador>(
    `/brand/ambassadors/${ambassadorId}`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function updateBrandAmbassadorStatus(
  token: string,
  ambassadorId: string,
  payload: UpdateBrandAmbassadorStatusPayload,
) {
  const response = await request<BrandAmbassador>(
    `/brand/ambassadors/${ambassadorId}/status`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function removeBrandAmbassador(token: string, ambassadorId: string) {
  const response = await request<BrandAmbassador>(
    `/brand/ambassadors/${ambassadorId}`,
    token,
    {
      method: "DELETE",
    },
  );
  return response.data;
}

export async function getBrandCreatorApplications(
  token: string,
  params: CampaignApplicationsQuery = {},
) {
  const payload = await request<ReviewerApplication[]>(
    `/brand/creator-applications${buildQueryString(params)}`,
    token,
  );
  return normalizePaginatedResult(payload);
}

export async function approveBrandCreatorApplication(
  token: string,
  applicationId: string,
) {
  const response = await request<ReviewerApplication>(
    `/brand/creator-applications/${applicationId}/approve`,
    token,
    { method: "PATCH" },
  );
  return response.data;
}

export async function rejectBrandCreatorApplication(
  token: string,
  applicationId: string,
  payload: { rejectionReason?: string },
) {
  const response = await request<ReviewerApplication>(
    `/brand/creator-applications/${applicationId}/reject`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function getBrandContentSubmissions(
  token: string,
  params: ContentSubmissionQuery = {},
) {
  const payload = await request<ReviewerContentSubmission[]>(
    `/brand/content-submissions${buildQueryString(params)}`,
    token,
  );
  return normalizePaginatedResult(payload);
}

export async function approveBrandContentSubmission(
  token: string,
  submissionId: string,
) {
  const response = await request<ReviewerContentSubmission>(
    `/brand/content-submissions/${submissionId}/approve`,
    token,
    { method: "PATCH" },
  );
  return response.data;
}

export async function rejectBrandContentSubmission(
  token: string,
  submissionId: string,
  payload: ReviewContentSubmissionPayload,
) {
  const response = await request<ReviewerContentSubmission>(
    `/brand/content-submissions/${submissionId}/reject`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function requestBrandContentChanges(
  token: string,
  submissionId: string,
  payload: ReviewContentSubmissionPayload,
) {
  const response = await request<ReviewerContentSubmission>(
    `/brand/content-submissions/${submissionId}/request-changes`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function getBrandAnalytics(token: string) {
  const response = await request<BrandAnalyticsResponse>("/brand/analytics", token);
  return response.data;
}
