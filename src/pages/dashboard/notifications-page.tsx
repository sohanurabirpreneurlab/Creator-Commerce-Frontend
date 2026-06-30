import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-dashboard-page";

export function NotificationsPage() {
  return (
    <PlaceholderDashboardPage
      title="Notifications"
      description="This page will later collect campaign invites, content approval updates, application responses, and payout notifications."
      upcomingFeatures={[
        "Unread notification feed with status filters.",
        "Workflow-specific alerts for invites, approvals, and revisions.",
        "Notification preferences and delivery options.",
      ]}
    />
  );
}
