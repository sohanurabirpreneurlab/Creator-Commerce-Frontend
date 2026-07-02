import { useEffect, useState } from "react";
import { BarChart3, RefreshCcw } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getBrandAnalytics } from "@/lib/brand-api";
import { getAdminAnalytics } from "@/lib/admin-api";
import type {
  AdminAnalyticsResponse,
  BrandAnalyticsResponse,
} from "@/types/analytics";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
import { TableLoadingState } from "@/components/dashboard/table-loading-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BreakdownBarCard,
  BreakdownDonutCard,
  DashboardMetricCard,
} from "@/components/dashboard/dashboard-visuals";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export function AnalyticsPage() {
  const { token, user } = useAuth();
  const [analytics, setAnalytics] = useState<BrandAnalyticsResponse | AdminAnalyticsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadAnalytics() {
    if (!token || !user) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response =
        user.role === "BRAND_MANAGER"
          ? await getBrandAnalytics(token)
          : await getAdminAnalytics(token);
      setAnalytics(response);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!token || !user) {
      return;
    }

    void loadAnalytics();
  }, [token, user?.role]);

  if (user?.role !== "BRAND_MANAGER" && user?.role !== "SUPER_ADMIN") {
    return (
      <DataTableEmptyState
        title="Access denied"
        description="Analytics are available only for brand managers and super admins."
      />
    );
  }

  const summaryEntries = analytics
    ? Object.entries(analytics.summary).map(([key, value]) => ({
        label: key.replace(/([A-Z])/g, " $1").trim(),
        value,
      }))
    : [];

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
              <BarChart3 className="h-4 w-4" />
              Operational Analytics
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              Analytics
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              These cards use real counts from campaigns, applications, ambassadors, content submissions, and tracking links.
            </p>
          </div>
          <Button type="button" variant="outline" className="gap-2" onClick={() => void loadAnalytics()}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {errorMessage ? (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </p>
        ) : null}
      </Card>

      {isLoading ? (
        <TableLoadingState message="Loading analytics..." />
      ) : analytics ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {summaryEntries.map((entry) => (
              <DashboardMetricCard
                key={entry.label}
                label={entry.label}
                value={entry.value}
              />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <BreakdownBarCard
              title="Campaign Status Breakdown"
              items={analytics.campaignStatusBreakdown}
            />
            <BreakdownDonutCard
              title="Application Status Breakdown"
              items={analytics.applicationStatusBreakdown}
            />
          </div>

          <Card className="p-6">
            <p className="text-sm leading-7 text-muted">{analytics.note}</p>
          </Card>
        </>
      ) : (
        <DataTableEmptyState
          title="Analytics unavailable"
          description="No analytics data was returned for this role."
        />
      )}
    </div>
  );
}
