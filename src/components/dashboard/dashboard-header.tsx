import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "./notifications/notification-bell";

export function DashboardHeader() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return null;
  }

  return (
    <header className="relative z-[70] overflow-visible rounded-[32px] border border-white/70 bg-white/85 p-6 shadow-soft backdrop-blur-xl">
      <div className="flex flex-row justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Dashboard
          </p>
          {/* <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
            {pageMeta?.label ?? "Creator Commerce"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            {pageMeta?.description ??
              "Manage your creator commerce workflow from one protected workspace."}
          </p> */}
        </div>

        <div className="relative z-[80] flex flex-wrap items-center gap-3">
          <NotificationBell />
          <div className="rounded-full border border-border text-center bg-slate-50 px-4 py-2 text-sm text-foreground">
            <span className="font-semibold">{user.name}</span> <br />
            <span className="ml-2 text-muted">{user.email}</span>
          </div>
          {/* <RoleBadge role={user.role} /> */}
          <Button
            variant="outline"
            onClick={() => {
              logout();
              navigate("/", { replace: true });
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
