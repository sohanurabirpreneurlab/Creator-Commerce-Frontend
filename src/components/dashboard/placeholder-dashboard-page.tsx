import { Card } from "@/components/ui/card";
import { RoleBadge } from "./role-badge";
import type { UserRole } from "@/types/auth";

type PlaceholderDashboardPageProps = {
  title: string;
  description: string;
  allowedRoles?: UserRole[];
  upcomingFeatures?: string[];
};

export function PlaceholderDashboardPage({
  title,
  description,
  allowedRoles,
  upcomingFeatures = [],
}: PlaceholderDashboardPageProps) {
  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Placeholder Page
            </p>
            <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
              {title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">{description}</p>
          </div>
          {allowedRoles?.length ? (
            <div className="flex flex-wrap gap-2">
              {allowedRoles.map((role) => (
                <RoleBadge key={role} role={role} />
              ))}
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="p-7">
        <h3 className="text-lg font-bold text-foreground">Upcoming Features</h3>
        <div className="mt-5 grid gap-3">
          {upcomingFeatures.map((feature) => (
            <div
              key={feature}
              className="rounded-3xl border border-border bg-slate-50 px-5 py-4 text-sm leading-6 text-muted"
            >
              {feature}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
