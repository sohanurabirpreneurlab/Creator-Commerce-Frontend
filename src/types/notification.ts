export type NotificationCategory =
  | "CAMPAIGN"
  | "APPLICATION"
  | "CONTENT"
  | "TRACKING_LINK"
  | "PROFILE"
  | "USER_ROLE"
  | "BRAND"
  | "AMBASSADOR"
  | "SYSTEM";

export type NotificationPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export type NotificationType =
  | "CAMPAIGN_CREATED"
  | "CAMPAIGN_SUBMITTED_FOR_APPROVAL"
  | "CAMPAIGN_PENDING_APPROVAL"
  | "CAMPAIGN_APPROVED"
  | "CAMPAIGN_REJECTED"
  | "CAMPAIGN_STATUS_CHANGED"
  | "CAMPAIGN_CANCELLED"
  | "CAMPAIGN_PAUSED"
  | "CAMPAIGN_COMPLETED"
  | "APPLICATION_SUBMITTED"
  | "CREATOR_APPLICATION_RECEIVED"
  | "APPLICATION_APPROVED"
  | "APPLICATION_REJECTED"
  | "APPLICATION_WITHDRAWN"
  | "TRACKING_LINK_GENERATED"
  | "TRACKING_LINK_DEACTIVATED"
  | "CONTENT_SUBMITTED"
  | "CONTENT_SUBMITTED_FOR_REVIEW"
  | "CONTENT_APPROVED"
  | "CONTENT_REJECTED"
  | "CONTENT_CHANGE_REQUESTED"
  | "CONTENT_RESUBMITTED"
  | "CREATOR_VERIFICATION_PENDING"
  | "CREATOR_VERIFICATION_APPROVED"
  | "CREATOR_VERIFICATION_REJECTED"
  | "PROFILE_UPDATED"
  | "BRAND_CREATED"
  | "BRAND_STATUS_CHANGED"
  | "BRAND_MANAGER_ASSIGNED"
  | "USER_ROLE_CHANGED"
  | "USER_STATUS_CHANGED"
  | "SYSTEM_ANNOUNCEMENT"
  | "SYSTEM_ALERT";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  entityType: string | null;
  entityId: string | null;
  actionUrl: string | null;
  metadata: Record<string, unknown>;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  inAppEnabled: boolean;
  campaignUpdatesEnabled: boolean;
  applicationUpdatesEnabled: boolean;
  contentUpdatesEnabled: boolean;
  trackingLinkUpdatesEnabled: boolean;
  profileUpdatesEnabled: boolean;
  systemUpdatesEnabled: boolean;
  emailEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  isRead?: boolean;
  category?: NotificationCategory;
  type?: NotificationType;
}

export type UpdateNotificationPreferencesPayload = Partial<
  Pick<
    NotificationPreferences,
    | "inAppEnabled"
    | "campaignUpdatesEnabled"
    | "applicationUpdatesEnabled"
    | "contentUpdatesEnabled"
    | "trackingLinkUpdatesEnabled"
    | "profileUpdatesEnabled"
    | "systemUpdatesEnabled"
    | "emailEnabled"
  >
>;
