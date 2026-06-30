import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-dashboard-page";

export function EarningsPage() {
  return (
    <PlaceholderDashboardPage
      title="Earnings"
      description="This area will later summarize estimated earnings, confirmed earnings, and payout status for creator activity."
      upcomingFeatures={[
        "Estimated vs confirmed earnings across campaigns.",
        "Payout status timeline and settlement visibility.",
        "Detailed earning line items by performance source.",
      ]}
    />
  );
}
