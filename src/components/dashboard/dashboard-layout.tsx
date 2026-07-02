import { Outlet } from "react-router-dom";
import { NotificationProvider } from "@/contexts/notification-provider";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eefbff_0%,#f7fbfc_44%,#ffffff_100%)]">
      <div className="flex min-h-screen flex-col lg:h-screen lg:flex-row lg:overflow-hidden">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6 lg:h-screen lg:overflow-y-auto lg:p-8">
          <NotificationProvider>
            <DashboardHeader />
            <main className="mt-6 flex-1">
              <Outlet />
            </main>
          </NotificationProvider>
        </div>
      </div>
    </div>
  );
}
