import { NavLink } from "react-router-dom";
import type { SidebarItem } from "@/config/sidebar-items";
import { cn } from "@/lib/utils";

type SidebarNavItemProps = {
  item: SidebarItem;
};

export function SidebarNavItem({ item }: SidebarNavItemProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          "group flex items-start gap-3 rounded-3xl border px-4 py-3 transition-all",
          isActive
            ? "border-primary/30 bg-primary/10 text-foreground shadow-soft"
            : "border-transparent bg-white/70 text-muted hover:border-border hover:text-foreground",
        )
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={cn(
              "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
              isActive ? "bg-white text-primary-dark" : "bg-slate-100 text-muted",
            )}
          >
            {Icon ? <Icon className="h-4 w-4" /> : null}
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-semibold">{item.label}</span>
            {item.description ? (
              <span className="mt-1 block text-xs leading-5 text-muted">
                {item.description}
              </span>
            ) : null}
          </span>
        </>
      )}
    </NavLink>
  );
}
