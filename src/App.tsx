import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { RoleProtectedRoute } from "@/components/auth/role-protected-route";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { LandingPage } from "@/components/landing/landing-page";
import { Navbar } from "@/components/layout/navbar";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-dashboard-page";
import { OverviewPage } from "@/pages/dashboard/overview-page";
import { ProfilePage } from "@/pages/dashboard/profile-page";
import { AvailableCampaignsPage } from "@/pages/dashboard/available-campaigns-page";
import { MyApplicationsPage } from "@/pages/dashboard/my-applications-page";
import { ContentSubmissionsPage } from "@/pages/dashboard/content-submissions-page";
import { TrackingLinksPage } from "@/pages/dashboard/tracking-links-page";
import { MyPerformancePage } from "@/pages/dashboard/my-performance-page";
import { EarningsPage } from "@/pages/dashboard/earnings-page";
import { NotificationsPage } from "@/pages/dashboard/notifications-page";
import { SettingsPage } from "@/pages/dashboard/settings-page";
import { AccessDeniedPage } from "@/pages/dashboard/access-denied-page";
import { UsersPage } from "@/pages/dashboard/users-page";
import type { UserRole } from "@/types/auth";

const commonDashboardRoles: UserRole[] = [
  "CREATOR",
  "BRAND_MANAGER",
  "SUPER_ADMIN",
];
const creatorOnly: UserRole[] = ["CREATOR"];
const brandManagerAndAbove: UserRole[] = ["BRAND_MANAGER", "SUPER_ADMIN"];
const superAdminOnly: UserRole[] = ["SUPER_ADMIN"];

function PublicHomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <LandingPage />
      </main>
    </div>
  );
}

function FutureDashboardPlaceholder({
  title,
  description,
  allowedRoles,
}: {
  title: string;
  description: string;
  allowedRoles: UserRole[];
}) {
  return (
    <RoleProtectedRoute allowedRoles={allowedRoles}>
      <PlaceholderDashboardPage
        title={title}
        description={description}
        allowedRoles={allowedRoles}
        upcomingFeatures={[
          "Role-specific data loading once the matching backend modules exist.",
          "Workflow actions and approvals for this operational area.",
          "Real metrics, pagination, and filters after APIs are added.",
        ]}
      />
    </RoleProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicHomePage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="/dashboard/overview" replace />} />
          <Route
            path="overview"
            element={
              <RoleProtectedRoute allowedRoles={commonDashboardRoles}>
                <OverviewPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <RoleProtectedRoute allowedRoles={commonDashboardRoles}>
                <ProfilePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="available-campaigns"
            element={
              <RoleProtectedRoute allowedRoles={creatorOnly}>
                <AvailableCampaignsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="my-applications"
            element={
              <RoleProtectedRoute allowedRoles={creatorOnly}>
                <MyApplicationsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="content-submissions"
            element={
              <RoleProtectedRoute allowedRoles={creatorOnly}>
                <ContentSubmissionsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="tracking-links"
            element={
              <RoleProtectedRoute allowedRoles={creatorOnly}>
                <TrackingLinksPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="my-performance"
            element={
              <RoleProtectedRoute allowedRoles={creatorOnly}>
                <MyPerformancePage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="earnings"
            element={
              <RoleProtectedRoute allowedRoles={creatorOnly}>
                <EarningsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <RoleProtectedRoute allowedRoles={commonDashboardRoles}>
                <NotificationsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <RoleProtectedRoute allowedRoles={commonDashboardRoles}>
                <SettingsPage />
              </RoleProtectedRoute>
            }
          />
          <Route path="access-denied" element={<AccessDeniedPage />} />
          <Route
            path="campaigns"
            element={
              <FutureDashboardPlaceholder
                title="Campaigns"
                description="This area will support brand-side campaign creation, editing, and launch workflows."
                allowedRoles={brandManagerAndAbove}
              />
            }
          />
          <Route
            path="brand-ambassadors"
            element={
              <FutureDashboardPlaceholder
                title="Brand Ambassadors"
                description="This page will later help brand managers review and organize high-value creator relationships."
                allowedRoles={brandManagerAndAbove}
              />
            }
          />
          <Route
            path="creator-applications"
            element={
              <FutureDashboardPlaceholder
                title="Creator Applications"
                description="This page will later show creator applications with review and shortlist workflows for brands."
                allowedRoles={brandManagerAndAbove}
              />
            }
          />
          <Route
            path="content-approvals"
            element={
              <FutureDashboardPlaceholder
                title="Content Approvals"
                description="This page will later support brand review and approval flows for creator submissions."
                allowedRoles={brandManagerAndAbove}
              />
            }
          />
          <Route
            path="analytics"
            element={
              <FutureDashboardPlaceholder
                title="Analytics"
                description="This area will later show campaign, creator, and revenue analytics by role."
                allowedRoles={brandManagerAndAbove}
              />
            }
          />
          <Route
            path="payouts"
            element={
              <FutureDashboardPlaceholder
                title="Payouts"
                description="This page will later support payout review and reconciliation workflows."
                allowedRoles={brandManagerAndAbove}
              />
            }
          />
          <Route
            path="brands"
            element={
              <FutureDashboardPlaceholder
                title="Brands"
                description="This page will later provide super admin brand management controls."
                allowedRoles={superAdminOnly}
              />
            }
          />
          <Route
            path="creators"
            element={
              <FutureDashboardPlaceholder
                title="Creators"
                description="This page will later provide super admin creator account oversight."
                allowedRoles={superAdminOnly}
              />
            }
          />
          <Route
            path="user-roles"
            element={
              <RoleProtectedRoute allowedRoles={superAdminOnly}>
                <UsersPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="users-roles"
            element={
              <Navigate to="/dashboard/user-roles" replace />
            }
          />
          <Route
            path="reports"
            element={
              <FutureDashboardPlaceholder
                title="Reports"
                description="This page will later provide super admin reporting and operational summaries."
                allowedRoles={superAdminOnly}
              />
            }
          />
          <Route
            path="system-settings"
            element={
              <FutureDashboardPlaceholder
                title="System Settings"
                description="This page will later expose global platform configuration for super admins."
                allowedRoles={superAdminOnly}
              />
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
