import { sidebarItems } from "@/config/sidebar-items";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "react-router-dom";
import { SidebarNavItem } from "./sidebar-nav-item";
import { Logo } from "@/components/layout/logo";
import { RoleBadge } from "./role-badge";

export function DashboardSidebar() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  // The sidebar is filtered on the client so each role sees its relevant navigation.
  // Backend APIs still need server-side authorization for real security.
  const visibleItems = sidebarItems.filter((item) => item.roles.includes(user.role));

  return (
    <aside className="w-full shrink-0 border-b border-white/70 bg-white/75 p-5 backdrop-blur-xl lg:h-screen lg:w-[320px] lg:overflow-y-auto lg:border-b-0 lg:border-r">
      <div className="lg:pr-2">
        <Link to="/" className="inline-flex">
          <Logo />
        </Link>
        <div className="mt-6 rounded-[28px] border border-primary/15 bg-primary/10 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
            Signed in as
          </p>
          <p className="mt-3 text-lg font-bold text-foreground">{user.name}</p>
          <p className="mt-1 text-sm text-muted">{user.email}</p>
          <RoleBadge role={user.role} className="mt-4" />
        </div>

        <nav className="mt-6 space-y-2">
          {visibleItems.map((item) => (
            <SidebarNavItem key={item.path} item={item} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
