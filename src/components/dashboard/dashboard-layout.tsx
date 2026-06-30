import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./dashboard-header";
import { DashboardSidebar } from "./dashboard-sidebar";

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#eefbff_0%,#f7fbfc_44%,#ffffff_100%)]">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <DashboardSidebar />
        <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-6 lg:p-8">
          <DashboardHeader />
          <main className="mt-6 flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
