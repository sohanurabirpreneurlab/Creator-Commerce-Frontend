import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, RefreshCcw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getMyContentSubmissions, getMyPerformance } from "@/lib/campaign-api";
import { getBrandAnalytics } from "@/lib/brand-api";
import { getAdminAnalytics } from "@/lib/admin-api";
import type {
  AdminAnalyticsResponse,
  BrandAnalyticsResponse,
} from "@/types/analytics";
import type { CreatorPerformanceResponse } from "@/types/performance";
import type { CreatorContentSubmission } from "@/types/content-submission";
import {
  BreakdownBarCard,
  BreakdownDonutCard,
  DashboardMetricCard,
} from "@/components/dashboard/dashboard-visuals";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
import { TableLoadingState } from "@/components/dashboard/table-loading-state";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatLabel(label: string) {
  return label.replace(/([A-Z])/g, " $1").trim();
}

type CreatorOverviewState = {
  performance: CreatorPerformanceResponse;
  contentSubmissions: CreatorContentSubmission[];
  totalContentSubmissions: number;
};

export function OverviewPage() {
  const { token, user } = useAuth();
  const [creatorOverview, setCreatorOverview] = useState<CreatorOverviewState | null>(
    null,
  );
  const [managerOverview, setManagerOverview] = useState<
    BrandAnalyticsResponse | AdminAnalyticsResponse | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadOverview() {
    if (!token || !user) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (user.role === "CREATOR") {
        const [performance, contentSubmissions] = await Promise.all([
          getMyPerformance(token),
          getMyContentSubmissions(token, { page: 1, limit: 100 }),
        ]);

        setCreatorOverview({
          performance,
          contentSubmissions: contentSubmissions.data,
          totalContentSubmissions:
            contentSubmissions.meta?.total ?? contentSubmissions.data.length,
        });
        setManagerOverview(null);
        return;
      }

      const analytics =
        user.role === "BRAND_MANAGER"
          ? await getBrandAnalytics(token)
          : await getAdminAnalytics(token);

      setManagerOverview(analytics);
      setCreatorOverview(null);
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

    void loadOverview();
  }, [token, user?.role]);

  const creatorSubmissionBreakdown = useMemo(() => {
    if (!creatorOverview) {
      return [];
    }

    const counts = new Map<string, number>();

    creatorOverview.contentSubmissions.forEach((submission) => {
      counts.set(submission.status, (counts.get(submission.status) ?? 0) + 1);
    });

    return Array.from(counts.entries()).map(([label, count]) => ({
      label,
      count,
    }));
  }, [creatorOverview]);

  const creatorSummaryCards = creatorOverview
    ? [
        {
          label: "Total Applications",
          value: creatorOverview.performance.summary.totalApplications,
          description: "Applications sent to live campaigns.",
        },
        {
          label: "Approved Applications",
          value: creatorOverview.performance.summary.approvedApplications,
          description: "Campaign approvals converted into active relationships.",
        },
        {
          label: "Active Tracking Links",
          value: creatorOverview.performance.summary.activeTrackingLinks,
          description: "Creator links currently ready to promote.",
        },
        {
          label: "Content Submissions",
          value: creatorOverview.totalContentSubmissions,
          description: "Drafts and submitted work across your campaigns.",
        },
        {
          label: "Estimated Clicks",
          value: creatorOverview.performance.summary.estimatedClicks,
          description: "Current modeled clicks from your approved campaigns.",
        },
        {
          label: "Estimated Earnings",
          value: formatCurrency(creatorOverview.performance.summary.estimatedEarnings),
          description: "Modeled payout estimate based on current performance.",
        },
      ]
    : [];

  const managerSummaryCards = managerOverview
    ? Object.entries(managerOverview.summary).map(([key, value]) => ({
        label: formatLabel(key),
        value,
      }))
    : [];

  if (!user) {
    return null;
  }

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
              <LayoutDashboard className="h-4 w-4" />
              Live Overview
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, {user.name}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              {user.role === "CREATOR"
                ? "Your overview now uses live creator performance, application, content submission, and tracking data."
                : "Your overview now uses live campaign and application analytics from the backend."}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="gap-2"
            onClick={() => void loadOverview()}
          >
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        {errorMessage ? (
          <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </p>
        ) : null}
      </Card>

      {isLoading ? <TableLoadingState message="Loading overview..." /> : null}

      {!isLoading && user.role === "CREATOR" && !creatorOverview ? (
        <DataTableEmptyState
          title="Overview unavailable"
          description="Your creator overview will appear here once performance data is available."
        />
      ) : null}

      {!isLoading && user.role !== "CREATOR" && !managerOverview ? (
        <DataTableEmptyState
          title="Overview unavailable"
          description="No overview data was returned for this role."
        />
      ) : null}

      {!isLoading && creatorOverview ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {creatorSummaryCards.map((card) => (
              <DashboardMetricCard
                key={card.label}
                label={card.label}
                value={card.value}
                description={card.description}
              />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <BreakdownBarCard
              title="Campaign Earnings Snapshot"
              items={creatorOverview.performance.campaignPerformance.map((item) => ({
                label: item.campaignTitle,
                count: item.estimatedEarnings,
              }))}
            />
            <BreakdownDonutCard
              title="Content Submission Status"
              items={creatorSubmissionBreakdown}
            />
          </div>

          <Card className="p-6">
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {creatorOverview.performance.note}
            </p>
          </Card>
        </>
      ) : null}

      {!isLoading && managerOverview ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {managerSummaryCards.map((card) => (
              <DashboardMetricCard
                key={card.label}
                label={card.label}
                value={card.value}
              />
            ))}
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <BreakdownBarCard
              title="Campaign Status Breakdown"
              items={managerOverview.campaignStatusBreakdown}
            />
            <BreakdownDonutCard
              title="Application Status Breakdown"
              items={managerOverview.applicationStatusBreakdown}
            />
          </div>

          <Card className="p-6">
            <p className="text-sm leading-7 text-muted">{managerOverview.note}</p>
          </Card>
        </>
      ) : null}
    </div>
  );
}
