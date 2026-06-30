import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-dashboard-page";

export function ContentSubmissionsPage() {
  return (
    <PlaceholderDashboardPage
      title="Content Submissions"
      description="This area will later help creators submit deliverables, review approval status, and manage revision requests from brands."
      upcomingFeatures={[
        "Submission timeline by campaign and deliverable type.",
        "Approval status, revision notes, and due date reminders.",
        "Upload workflow hooks once content APIs exist.",
      ]}
    />
  );
}
