import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-dashboard-page";

export function MyApplicationsPage() {
  return (
    <PlaceholderDashboardPage
      title="My Applications"
      description="This page will later track creator applications across campaigns with review stages, approvals, and rejections."
      upcomingFeatures={[
        "Application pipeline grouped by pending, shortlisted, accepted, or rejected.",
        "Brand feedback and required next steps for each application.",
        "Search and filters to quickly find open or closed applications.",
      ]}
    />
  );
}
