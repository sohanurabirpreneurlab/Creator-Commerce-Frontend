export type UserRole = "CREATOR" | "BRAND_MANAGER" | "SUPER_ADMIN";

export interface ProfileCompletion {
  percentage: number;
  completedFields: number;
  totalFields: number;
  missingFields: string[];
}

export interface BaseProfileUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatorProfileData {
  id: string;
  displayName: string;
  bio: string | null;
  category: string | null;
  location: string | null;
  profileImageUrl: string | null;
  verificationStatus: string;
}

export interface CreatorSocialAccount {
  id: string;
  platform: string;
  profileUrl: string;
  followersCount: number;
  engagementRate: number | null;
  verified: boolean;
}

export interface BrandManagerData {
  id: string;
  designation: string | null;
  status: string;
}

export interface BrandData {
  id: string;
  name: string;
  industry: string | null;
  website: string | null;
  logoUrl: string | null;
  contactEmail: string | null;
  status: string;
}

export interface CreatorProfileResponse {
  role: "CREATOR";
  profileType: "CREATOR_PROFILE";
  user: BaseProfileUser;
  creatorProfile: CreatorProfileData | null;
  socialAccounts: CreatorSocialAccount[];
  completion: ProfileCompletion;
}

export interface BrandManagerProfileResponse {
  role: "BRAND_MANAGER";
  profileType: "BRAND_MANAGER_PROFILE";
  user: BaseProfileUser;
  brandManager: BrandManagerData;
  brand: BrandData;
  completion: ProfileCompletion;
}

export interface SuperAdminProfileResponse {
  role: "SUPER_ADMIN";
  profileType: "SUPER_ADMIN_PROFILE";
  user: BaseProfileUser;
  completion: ProfileCompletion;
}

export type ProfileResponse =
  | CreatorProfileResponse
  | BrandManagerProfileResponse
  | SuperAdminProfileResponse;

export interface UpdateProfilePayload {
  user?: {
    name?: string;
  };
  creatorProfile?: {
    displayName?: string;
    bio?: string;
    category?: string;
    location?: string;
    profileImageUrl?: string;
  };
  brandManager?: {
    designation?: string;
  };
  brand?: {
    name?: string;
    industry?: string;
    website?: string;
    contactEmail?: string;
    logoUrl?: string;
  };
}

export interface ApiSuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error: {
    code: string;
    details?: Record<string, unknown>;
  };
}
