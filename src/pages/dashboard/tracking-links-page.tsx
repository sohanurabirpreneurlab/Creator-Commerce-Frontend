import { useEffect, useState } from "react";
import { Copy, ExternalLink, RefreshCcw, Search } from "lucide-react";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { TableLoadingState } from "@/components/dashboard/table-loading-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { getMyTrackingLinks } from "@/lib/campaign-api";
import type {
  CreatorTrackingLink,
  TrackingLinkStatus,
} from "@/types/tracking-link";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function TrackingLinksPage() {
  const { token } = useAuth();
  const [trackingLinks, setTrackingLinks] = useState<CreatorTrackingLink[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<TrackingLinkStatus | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);

  async function loadTrackingLinks() {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getMyTrackingLinks(token, {
        page: 1,
        limit: 20,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      });
      setTrackingLinks(result.data);
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

    const timeoutId = window.setTimeout(() => {
      void loadTrackingLinks();
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [token, search, statusFilter]);

  const handleCopy = async (trackingLink: CreatorTrackingLink) => {
    try {
      await navigator.clipboard.writeText(trackingLink.trackingUrl);
      setCopiedLinkId(trackingLink.id);
      window.setTimeout(() => {
        setCopiedLinkId((current) => (current === trackingLink.id ? null : current));
      }, 1800);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Creator Promotion Links
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
              Tracking Links
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Browse your campaign links, copy them for sharing, and verify the
              current link status before promoting a campaign.
            </p>
          </div>

          <Button type="button" variant="outline" className="gap-2" onClick={() => void loadTrackingLinks()}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-11"
              placeholder="Search by campaign, brand, or short code..."
            />
          </div>

          <select
            className="flex h-12 rounded-full border border-slate-200 bg-white px-4 text-sm text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as TrackingLinkStatus | "")
            }
          >
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="DEACTIVATED">Deactivated</option>
            <option value="EXPIRED">Expired</option>
          </select>
        </div>

        {errorMessage ? (
          <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </p>
        ) : null}
      </Card>

      {isLoading ? <TableLoadingState message="Loading tracking links..." /> : null}

      {!isLoading && trackingLinks.length === 0 ? (
        <DataTableEmptyState
          title="No tracking links found"
          description="Tracking links will appear here when you are approved for campaigns and link generation is completed."
        />
      ) : null}

      {!isLoading && trackingLinks.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Short Code</th>
                  <th className="px-6 py-4">Tracking Link</th>
                  <th className="px-6 py-4">Destination URL</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {trackingLinks.map((trackingLink) => (
                  <tr key={trackingLink.id}>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {trackingLink.campaign.title}
                    </td>
                    <td className="px-6 py-4">{trackingLink.brand.name}</td>
                    <td className="px-6 py-4">{trackingLink.shortCode}</td>
                    <td className="px-6 py-4">
                      <a
                        href={trackingLink.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-700 underline underline-offset-4"
                      >
                        {trackingLink.trackingUrl}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={trackingLink.destinationUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-700 underline underline-offset-4"
                      >
                        Open destination
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={trackingLink.status} />
                    </td>
                    <td className="px-6 py-4">{formatDate(trackingLink.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => void handleCopy(trackingLink)}
                        >
                          <Copy className="mr-2 h-4 w-4" />
                          {copiedLinkId === trackingLink.id ? "Copied" : "Copy"}
                        </Button>
                        <Button
                          type="button"
                          onClick={() =>
                            window.open(
                              trackingLink.destinationUrl,
                              "_blank",
                              "noopener,noreferrer",
                            )
                          }
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Open
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
