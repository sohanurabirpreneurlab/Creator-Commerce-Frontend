import { apiRequest } from "@/lib/api-request";
import type { AdminAnalyticsResponse } from "@/types/analytics";
import type {
  AdminUserSummary,
  RoleBreakdownItem,
  UpdateUserRolePayload,
  UpdateUserStatusPayload,
  UserQuery,
} from "@/types/admin-user";
import type {
  BrandAmbassador,
  BrandAmbassadorQuery,
  UpdateBrandAmbassadorStatusPayload,
} from "@/types/brand-ambassador";
import type {
  Brand,
  BrandQuery,
  CreateBrandPayload,
  UpdateBrandPayload,
  UpdateBrandStatusPayload,
} from "@/types/brand";
import type {
  CampaignApiSuccessResponse,
  CampaignApplicationsQuery,
  ManagedCampaign,
  ManagedCampaignsQuery,
  ReviewerApplication,
} from "@/types/campaign";
import type {
  ReviewerContentSubmission,
  ContentSubmissionQuery,
  UpdateContentSubmissionStatusPayload,
} from "@/types/content-submission";
import type {
  CreatorListItem,
  CreatorQuery,
  UpdateCreatorVerificationPayload,
} from "@/types/creator";

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
  const payload = await apiRequest<T>(path, { ...options, token });
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

export async function getAdminCampaigns(
  token: string,
  params: ManagedCampaignsQuery = {},
) {
  const payload = await request<ManagedCampaign[]>(
    `/admin/campaigns${buildQueryString(params)}`,
    token,
  );
  return normalizePaginatedResult(payload);
}

export async function updateAdminCampaignStatus(
  token: string,
  campaignId: string,
  payload: { status: ManagedCampaign["status"] },
) {
  const response = await request<ManagedCampaign>(
    `/admin/campaigns/${campaignId}/status`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function getAdminBrands(token: string, params: BrandQuery = {}) {
  const payload = await request<Brand[]>(
    `/admin/brands${buildQueryString(params)}`,
    token,
  );
  return normalizePaginatedResult(payload);
}

export async function createAdminBrand(
  token: string,
  payload: CreateBrandPayload,
) {
  const response = await request<Brand>("/admin/brands", token, {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateAdminBrand(
  token: string,
  brandId: string,
  payload: UpdateBrandPayload,
) {
  const response = await request<Brand>(`/admin/brands/${brandId}`, token, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return response.data;
}

export async function updateAdminBrandStatus(
  token: string,
  brandId: string,
  payload: UpdateBrandStatusPayload,
) {
  const response = await request<Brand>(
    `/admin/brands/${brandId}/status`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function getAdminCreators(token: string, params: CreatorQuery = {}) {
  const payload = await request<CreatorListItem[]>(
    `/admin/creators${buildQueryString(params)}`,
    token,
  );
  return normalizePaginatedResult(payload);
}

export async function updateAdminCreatorVerification(
  token: string,
  creatorId: string,
  payload: UpdateCreatorVerificationPayload,
) {
  const response = await request<CreatorListItem>(
    `/admin/creators/${creatorId}/status`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function getAdminUsers(token: string, params: UserQuery = {}) {
  const payload = await request<AdminUserSummary[]>(
    `/admin/users${buildQueryString(params)}`,
    token,
  );
  return normalizePaginatedResult(payload);
}

export async function getAdminRolesBreakdown(token: string) {
  const response = await request<RoleBreakdownItem[]>(
    "/admin/roles/breakdown",
    token,
  );
  return response.data;
}

export async function updateAdminUserRole(
  token: string,
  userId: string,
  payload: UpdateUserRolePayload,
) {
  const response = await request<AdminUserSummary>(
    `/admin/users/${userId}/role`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function updateAdminUserStatus(
  token: string,
  userId: string,
  payload: UpdateUserStatusPayload,
) {
  const response = await request<AdminUserSummary>(
    `/admin/users/${userId}/status`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function getAdminBrandAmbassadors(
  token: string,
  params: BrandAmbassadorQuery = {},
) {
  const payload = await request<BrandAmbassador[]>(
    `/admin/brand-ambassadors${buildQueryString(params)}`,
    token,
  );
  return normalizePaginatedResult(payload);
}

export async function updateAdminBrandAmbassadorStatus(
  token: string,
  ambassadorId: string,
  payload: UpdateBrandAmbassadorStatusPayload,
) {
  const response = await request<BrandAmbassador>(
    `/admin/brand-ambassadors/${ambassadorId}/status`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function getAdminCreatorApplications(
  token: string,
  params: CampaignApplicationsQuery = {},
) {
  const payload = await request<ReviewerApplication[]>(
    `/admin/creator-applications${buildQueryString(params)}`,
    token,
  );
  return normalizePaginatedResult(payload);
}

export async function getAdminContentSubmissions(
  token: string,
  params: ContentSubmissionQuery = {},
) {
  const payload = await request<ReviewerContentSubmission[]>(
    `/admin/content-submissions${buildQueryString(params)}`,
    token,
  );
  return normalizePaginatedResult(payload);
}

export async function updateAdminContentSubmissionStatus(
  token: string,
  submissionId: string,
  payload: UpdateContentSubmissionStatusPayload,
) {
  const response = await request<ReviewerContentSubmission>(
    `/admin/content-submissions/${submissionId}/status`,
    token,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );
  return response.data;
}

export async function getAdminAnalytics(token: string) {
  const response = await request<AdminAnalyticsResponse>("/admin/analytics", token);
  return response.data;
}
