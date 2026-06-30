import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-dashboard-page";

export function MyPerformancePage() {
  return (
    <PlaceholderDashboardPage
      title="My Performance"
      description="This page will later show creator-side performance metrics such as clicks, conversions, attributed revenue, and ROI impact."
      upcomingFeatures={[
        "Performance charts for clicks, conversions, and attributed sales.",
        "Campaign-level leaderboard and historical trend views.",
        "Future comparison by channel, campaign, and date range.",
      ]}
    />
  );
}
