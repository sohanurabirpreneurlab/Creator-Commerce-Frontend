import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { RoleProtectedRoute } from "@/components/auth/role-protected-route";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PlaceholderDashboardPage } from "@/components/dashboard/placeholder-dashboard-page";
import { NotificationProvider } from "@/contexts/notification-provider";
import { LandingPage } from "@/components/landing/landing-page";
import { Navbar } from "@/components/layout/navbar";
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
import { AnalyticsPage } from "@/pages/dashboard/analytics-page";
import { AmbassadorsPage } from "@/pages/dashboard/ambassadors-page";
import { BrandsPage } from "@/pages/dashboard/brands-page";
import { CampaignsPage } from "@/pages/dashboard/campaigns-page";
import { ContentApprovalsPage } from "@/pages/dashboard/content-approvals-page";
import { CreatorApplicationsPage } from "@/pages/dashboard/creator-applications-page";
import { CreatorsPage } from "@/pages/dashboard/creators-page";
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

function PublicHomePage() {
  return (
    <NotificationProvider>
      <div className="min-h-screen">
        <Navbar />
        <main>
          <LandingPage />
        </main>
      </div>
    </NotificationProvider>
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
              <RoleProtectedRoute allowedRoles={brandManagerAndAbove}>
                <CampaignsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="brand-ambassadors"
            element={
              <RoleProtectedRoute allowedRoles={brandManagerAndAbove}>
                <AmbassadorsPage />
              </RoleProtectedRoute>
            }
          />
          <Route path="ambassadors" element={<Navigate to="/dashboard/brand-ambassadors" replace />} />
          <Route
            path="creator-applications"
            element={
              <RoleProtectedRoute allowedRoles={brandManagerAndAbove}>
                <CreatorApplicationsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="content-approvals"
            element={
              <RoleProtectedRoute allowedRoles={brandManagerAndAbove}>
                <ContentApprovalsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="analytics"
            element={
              <RoleProtectedRoute allowedRoles={brandManagerAndAbove}>
                <AnalyticsPage />
              </RoleProtectedRoute>
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
              <RoleProtectedRoute allowedRoles={superAdminOnly}>
                <BrandsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="creators"
            element={
              <RoleProtectedRoute allowedRoles={superAdminOnly}>
                <CreatorsPage />
              </RoleProtectedRoute>
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
            path="users"
            element={<Navigate to="/dashboard/user-roles" replace />}
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
