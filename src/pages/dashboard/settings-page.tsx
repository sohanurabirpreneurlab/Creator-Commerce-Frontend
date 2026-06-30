import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-dashboard-page";

export function SettingsPage() {
  return (
    <PlaceholderDashboardPage
      title="Settings"
      description="This page will later manage account preferences, password updates, session visibility, and other creator account settings."
      upcomingFeatures={[
        "Profile and account preference controls.",
        "Security settings and connected sessions.",
        "Notification and communication preferences.",
      ]}
    />
  );
}
