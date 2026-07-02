import { useEffect, useState } from "react";
import { Copy, ExternalLink, RefreshCcw, Search } from "lucide-react";
import { CampaignDetailsModal } from "@/components/dashboard/campaigns/campaign-details-modal";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { TableLoadingState } from "@/components/dashboard/table-loading-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import {
  getCreatorCampaignDetails,
  getMyApplications,
  withdrawApplication,
} from "@/lib/campaign-api";
import type {
  AvailableCampaign,
  CampaignApplicationStatus,
  CreatorApplication,
} from "@/types/campaign";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleDateString();
}

export function MyApplicationsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState<CreatorApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignApplicationStatus | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<AvailableCampaign | null>(
    null,
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);
  const [copiedTrackingLinkId, setCopiedTrackingLinkId] = useState<string | null>(null);

  async function loadApplications() {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getMyApplications(token, {
        page: 1,
        limit: 20,
        status: statusFilter || undefined,
        search: search.trim() || undefined,
      });
      setApplications(result.data);
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
      void loadApplications();
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [token, search, statusFilter]);

  const handleOpenDetails = async (application: CreatorApplication) => {
    if (!token) {
      return;
    }

    setIsDetailsOpen(true);
    setIsDetailsLoading(true);

    try {
      const campaign = await getCreatorCampaignDetails(token, application.campaign.id);
      setSelectedCampaign(campaign);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleWithdraw = async (applicationId: string) => {
    if (!token) {
      return;
    }

    setWithdrawingId(applicationId);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const updatedApplication = await withdrawApplication(token, applicationId);
      setApplications((currentApplications) =>
        currentApplications.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status: updatedApplication.status,
                updatedAt: updatedApplication.updatedAt,
              }
            : application,
        ),
      );
      setSuccessMessage("Application withdrawn successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setWithdrawingId(null);
    }
  };

  const handleCopyTrackingLink = async (application: CreatorApplication) => {
    if (!application.trackingLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(application.trackingLink.trackingUrl);
      setCopiedTrackingLinkId(application.trackingLink.id);
      window.setTimeout(() => {
        setCopiedTrackingLinkId((current) =>
          current === application.trackingLink?.id ? null : current,
        );
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
              Creator Application History
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
              My Applications
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Review every campaign application you have submitted, track the
              latest status, and withdraw a pending application when needed.
            </p>
          </div>

          <Button type="button" variant="outline" className="gap-2" onClick={() => void loadApplications()}>
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
              placeholder="Search by campaign title or brand name..."
            />
          </div>

          <select
            className="flex h-12 rounded-full border border-slate-200 bg-white px-4 text-sm text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as CampaignApplicationStatus | "")
            }
          >
            <option value="">All statuses</option>
            <option value="APPLIED">Applied</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>

        {successMessage ? (
          <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </p>
        ) : null}
      </Card>

      {isLoading ? <TableLoadingState message="Loading applications..." /> : null}

      {!isLoading && applications.length === 0 ? (
        <DataTableEmptyState
          title="No applications found"
          description="Your applications will appear here once you start applying to active campaigns."
        />
      ) : null}

      {!isLoading && applications.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Objective</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Proposed Content</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Expected Post Date</th>
                  <th className="px-6 py-4">Tracking Link</th>
                  <th className="px-6 py-4">Applied At</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">
                        {application.campaign.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">{application.brand.name}</td>
                    <td className="px-6 py-4">
                      {application.campaign.objective.replaceAll("_", " ")}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={application.status} />
                    </td>
                    <td className="px-6 py-4">
                      {application.proposedContentType?.replaceAll("_", " ") || "Not provided"}
                    </td>
                    <td className="px-6 py-4">
                      {application.primaryPlatform || "Not provided"}
                    </td>
                    <td className="px-6 py-4">
                      {formatDate(application.expectedPostDate)}
                    </td>
                    <td className="px-6 py-4">
                      {application.trackingLink ? (
                        <div className="grid gap-2">
                          <a
                            href={application.trackingLink.trackingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="max-w-xs truncate text-sky-700 underline underline-offset-4"
                          >
                            {application.trackingLink.trackingUrl}
                          </a>
                          <div className="flex flex-wrap gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => void handleCopyTrackingLink(application)}
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              {copiedTrackingLinkId === application.trackingLink.id
                                ? "Copied"
                                : "Copy"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                window.open(
                                  application.trackingLink?.trackingUrl,
                                  "_blank",
                                  "noopener,noreferrer",
                                )
                              }
                            >
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open
                            </Button>
                          </div>
                        </div>
                      ) : (
                        "Not generated"
                      )}
                    </td>
                    <td className="px-6 py-4">{formatDate(application.appliedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => void handleOpenDetails(application)}
                        >
                          View Details
                        </Button>
                        <Button
                          type="button"
                          disabled={
                            application.status !== "APPLIED" ||
                            withdrawingId === application.id
                          }
                          onClick={() => void handleWithdraw(application.id)}
                        >
                          {withdrawingId === application.id ? "Withdrawing..." : "Withdraw"}
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

      <CampaignDetailsModal
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        campaign={selectedCampaign}
        isLoading={isDetailsLoading}
        onApply={() => undefined}
      />
    </div>
  );
}
