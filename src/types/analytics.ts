export interface AnalyticsBreakdownItem {
  label: string;
  count: number;
}

export interface BrandAnalyticsResponse {
  summary: {
    totalCampaigns: number;
    activeCampaigns: number;
    totalApplications: number;
    approvedApplications: number;
    totalAmbassadors: number;
    totalContentSubmissions: number;
    approvedContentSubmissions: number;
    totalTrackingLinks: number;
  };
  campaignStatusBreakdown: AnalyticsBreakdownItem[];
  applicationStatusBreakdown: AnalyticsBreakdownItem[];
  note: string;
}

export interface AdminAnalyticsResponse {
  summary: {
    totalBrands: number;
    totalCreators: number;
    totalBrandManagers: number;
    totalCampaigns: number;
    activeCampaigns: number;
    totalApplications: number;
    totalAmbassadors: number;
    totalContentSubmissions: number;
    totalTrackingLinks: number;
  };
  campaignStatusBreakdown: AnalyticsBreakdownItem[];
  applicationStatusBreakdown: AnalyticsBreakdownItem[];
  note: string;
}
