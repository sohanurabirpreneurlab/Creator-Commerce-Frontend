import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/auth";

type RoleBadgeProps = {
  role: UserRole;
  className?: string;
};

const roleTone: Record<UserRole, string> = {
  CREATOR: "bg-primary/15 text-primary-dark border-primary/25",
  BRAND_MANAGER: "bg-amber-100 text-amber-700 border-amber-200",
  SUPER_ADMIN: "bg-slate-900 text-white border-slate-900",
};

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.14em]",
        roleTone[role],
        className,
      )}
    >
      {role.replace("_", " ")}
    </span>
  );
}
