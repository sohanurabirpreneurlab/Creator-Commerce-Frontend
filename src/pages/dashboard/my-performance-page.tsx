import { useEffect, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
import { TableLoadingState } from "@/components/dashboard/table-loading-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { getMyPerformance } from "@/lib/campaign-api";
import type { CreatorPerformanceResponse } from "@/types/performance";

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

export function MyPerformancePage() {
  const { token } = useAuth();
  const [performance, setPerformance] = useState<CreatorPerformanceResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function loadPerformance() {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getMyPerformance(token);
      setPerformance(result);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!token) {
      return;
    }

    void loadPerformance();
  }, [token]);

  const summaryCards = performance
    ? [
        { label: "Total Applications", value: performance.summary.totalApplications },
        { label: "Approved Applications", value: performance.summary.approvedApplications },
        { label: "Active Tracking Links", value: performance.summary.activeTrackingLinks },
        { label: "Estimated Clicks", value: performance.summary.estimatedClicks },
        { label: "Estimated Conversions", value: performance.summary.estimatedConversions },
        {
          label: "Estimated Earnings",
          value: formatCurrency(performance.summary.estimatedEarnings),
        },
      ]
    : [];

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Creator Demo Performance
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
              My Performance
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              This page combines real application and tracking-link counts with
              deterministic demo performance estimates until analytics tracking is
              implemented later.
            </p>
          </div>

          <Button type="button" variant="outline" className="gap-2" onClick={() => void loadPerformance()}>
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

      {isLoading ? <TableLoadingState message="Loading creator performance..." /> : null}

      {!isLoading && !performance ? (
        <DataTableEmptyState
          title="Performance data unavailable"
          description="Creator performance will appear here once seeded data or campaign activity is available."
        />
      ) : null}

      {!isLoading && performance ? (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {summaryCards.map((item) => (
              <Card key={item.label} className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  {item.label}
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
                  {item.value}
                </p>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {performance.note}
            </p>
          </Card>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr className="text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                    <th className="px-6 py-4">Campaign</th>
                    <th className="px-6 py-4">Brand</th>
                    <th className="px-6 py-4">Clicks</th>
                    <th className="px-6 py-4">Conversions</th>
                    <th className="px-6 py-4">Estimated Earnings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                  {performance.campaignPerformance.map((item) => (
                    <tr key={item.campaignId}>
                      <td className="px-6 py-4 font-semibold text-foreground">
                        {item.campaignTitle}
                      </td>
                      <td className="px-6 py-4">{item.brandName}</td>
                      <td className="px-6 py-4">{item.clicks}</td>
                      <td className="px-6 py-4">{item.conversions}</td>
                      <td className="px-6 py-4">
                        {formatCurrency(item.estimatedEarnings)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
