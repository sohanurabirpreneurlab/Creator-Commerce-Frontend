import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-dashboard-page";

export function ProfilePage() {
  return (
    <PlaceholderDashboardPage
      title="Profile"
      description="This area will later manage the creator profile, social accounts, category fit, audience details, and other brand-facing profile fields."
      upcomingFeatures={[
        "Editable creator bio, niche, and personal brand summary.",
        "Social platform account connections and audience snapshots.",
        "Category, rate card, and profile completeness guidance.",
      ]}
    />
  );
}
