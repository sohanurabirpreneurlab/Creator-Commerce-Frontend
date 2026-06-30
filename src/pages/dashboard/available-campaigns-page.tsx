import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-dashboard-page";

export function AvailableCampaignsPage() {
  return (
    <PlaceholderDashboardPage
      title="Available Campaigns"
      description="This page will later show campaigns that a creator can browse and apply to based on fit, eligibility, and campaign requirements."
      upcomingFeatures={[
        "Campaign discovery cards with filters for niche, platform, and payout model.",
        "Application CTA and eligibility checks against creator profile data.",
        "Campaign brief details, deadlines, and payout expectations.",
      ]}
    />
  );
}
