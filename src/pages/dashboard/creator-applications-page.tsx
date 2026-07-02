import { useEffect, useState } from "react";
import { Copy, ExternalLink, Eye, RefreshCcw, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  approveBrandCreatorApplication,
  getBrandCreatorApplications,
  rejectBrandCreatorApplication,
} from "@/lib/brand-api";
import { getAdminCreatorApplications } from "@/lib/admin-api";
import type {
  CampaignApplicationStatus,
  ReviewerApplication,
} from "@/types/campaign";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { TableLoadingState } from "@/components/dashboard/table-loading-state";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const APPLICATION_STATUSES: Array<CampaignApplicationStatus | "ALL"> = [
  "ALL",
  "APPLIED",
  "APPROVED",
  "REJECTED",
  "WITHDRAWN",
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : "Not set";
}

export function CreatorApplicationsPage() {
  const { token, user } = useAuth();
  const [applications, setApplications] = useState<ReviewerApplication[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignApplicationStatus | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<ReviewerApplication | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRejectOpen, setIsRejectOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [approvingApplicationId, setApprovingApplicationId] = useState<string | null>(null);
  const [copiedTrackingLinkId, setCopiedTrackingLinkId] = useState<string | null>(null);

  const isBrandManager = user?.role === "BRAND_MANAGER";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  async function loadApplications() {
    if (!token || (!isBrandManager && !isSuperAdmin)) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const params = {
        page: 1,
        limit: 100,
        search: search.trim() || undefined,
        status: statusFilter === "ALL" ? undefined : statusFilter,
      };

      const response = isBrandManager
        ? await getBrandCreatorApplications(token, params)
        : await getAdminCreatorApplications(token, params);

      setApplications(response.data);
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

    return () => window.clearTimeout(timeoutId);
  }, [token, search, statusFilter, user?.role]);

  const handleApprove = async (application: ReviewerApplication) => {
    if (!token || !isBrandManager) {
      return;
    }

    setApprovingApplicationId(application.id);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const approvalResult = await approveBrandCreatorApplication(token, application.id);
      setApplications((currentApplications) =>
        currentApplications.map((item) =>
          item.id === application.id
            ? approvalResult.application
            : item,
        ),
      );
      setSuccessMessage("Application approved and tracking link generated.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setApprovingApplicationId(null);
    }
  };

  const handleCopyTrackingLink = async (application: ReviewerApplication) => {
    if (!application.trackingLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(application.trackingLink.trackingUrl);
      setCopiedTrackingLinkId(application.trackingLink.id);
      window.setTimeout(() => {
        setCopiedTrackingLinkId((currentId) =>
          currentId === application.trackingLink?.id ? null : currentId,
        );
      }, 1800);
    } catch {
      setErrorMessage("Could not copy link. Please copy manually.");
    }
  };

  const handleReject = async () => {
    if (!token || !selectedApplication || !isBrandManager) {
      return;
    }

    try {
      const updatedApplication = await rejectBrandCreatorApplication(
        token,
        selectedApplication.id,
        {
          rejectionReason,
        },
      );

      setApplications((currentApplications) =>
        currentApplications.map((item) =>
          item.id === selectedApplication.id
            ? {
                ...item,
                status: updatedApplication.status,
                reviewedAt: updatedApplication.reviewedAt,
                rejectionReason: updatedApplication.rejectionReason,
              }
            : item,
        ),
      );
      setSuccessMessage("Application rejected successfully.");
      setIsRejectOpen(false);
      setRejectionReason("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  if (!isBrandManager && !isSuperAdmin) {
    return (
      <DataTableEmptyState
        title="Access denied"
        description="Creator applications are available only for brand managers and super admins."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Creator Applications
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              {isBrandManager
                ? "Review applications for campaigns in your assigned brand and approve or reject with a clear reason."
                : "Monitor creator applications across the full platform from a single operational table."}
            </p>
          </div>
          <Button type="button" variant="outline" className="gap-2" onClick={() => void loadApplications()}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by creator, campaign, or brand..." className="pl-11" />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as CampaignApplicationStatus | "ALL")} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm">
            {APPLICATION_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status === "ALL" ? "All statuses" : status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {successMessage ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p> : null}
        {errorMessage ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</p> : null}
      </Card>

      {isLoading ? (
        <TableLoadingState message="Loading creator applications..." />
      ) : applications.length === 0 ? (
        <DataTableEmptyState title="No applications found" description="Try a different search or status filter." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-6 py-4">Creator</th>
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Proposed Content</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Tracking Link</th>
                  <th className="px-6 py-4">Expected Post Date</th>
                  <th className="px-6 py-4">Applied At</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {applications.map((application) => (
                  <tr key={application.id}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{application.creator.displayName}</p>
                      <p className="mt-1 text-xs text-muted">{application.creator.userEmail}</p>
                    </td>
                    <td className="px-6 py-4">{application.campaign.title}</td>
                    <td className="px-6 py-4">{application.brand.name}</td>
                    <td className="px-6 py-4"><StatusBadge status={application.status} /></td>
                    <td className="px-6 py-4">{application.proposedContentType?.replaceAll("_", " ") || "Not set"}</td>
                    <td className="px-6 py-4">{application.primaryPlatform || "Not set"}</td>
                    <td className="px-6 py-4">
                      {approvingApplicationId === application.id ? (
                        <span className="text-sm font-semibold text-sky-700">
                          Generating tracking link...
                        </span>
                      ) : application.trackingLink ? (
                        <div className="grid min-w-64 gap-2">
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
                                ? "Link copied"
                                : "Copy Link"}
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
                      ) : application.status === "APPROVED" ? (
                        <span className="text-sm font-semibold text-amber-700">
                          Link missing
                        </span>
                      ) : application.status === "APPLIED" ? (
                        "Not generated yet"
                      ) : (
                        "Not available"
                      )}
                    </td>
                    <td className="px-6 py-4">{formatDate(application.expectedPostDate)}</td>
                    <td className="px-6 py-4">{formatDate(application.appliedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="justify-start gap-2" onClick={() => { setSelectedApplication(application); setIsDetailsOpen(true); }}>
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        {isBrandManager && application.status === "APPLIED" ? (
                          <>
                            <Button
                              type="button"
                              variant="outline"
                              disabled={approvingApplicationId === application.id}
                              onClick={() => void handleApprove(application)}
                            >
                              {approvingApplicationId === application.id
                                ? "Generating link..."
                                : "Approve"}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              disabled={approvingApplicationId === application.id}
                              onClick={() => { setSelectedApplication(application); setRejectionReason(""); setIsRejectOpen(true); }}
                            >
                              Reject
                            </Button>
                          </>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="w-[95vw] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedApplication?.campaign.title ?? "Application details"}</DialogTitle>
            <DialogDescription>Review creator pitch, campaign context, and current application state.</DialogDescription>
          </DialogHeader>
          {selectedApplication ? (
            <div className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
              <Card className="p-5">
                <p><span className="font-bold text-foreground">Creator:</span> {selectedApplication.creator.displayName}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Message:</span> {selectedApplication.message || "No message provided."}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Platform:</span> {selectedApplication.primaryPlatform || "Not set"}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Tracking Link:</span> {selectedApplication.trackingLink?.trackingUrl || "Not generated"}</p>
              </Card>
              <Card className="p-5">
                <p><span className="font-bold text-foreground">Brand:</span> {selectedApplication.brand.name}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Status:</span> <span className="ml-2"><StatusBadge status={selectedApplication.status} /></span></p>
                <p className="mt-3"><span className="font-bold text-foreground">Rejection Reason:</span> {selectedApplication.rejectionReason || "None"}</p>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isRejectOpen} onOpenChange={setIsRejectOpen}>
        <DialogContent className="w-[95vw] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reject application</DialogTitle>
            <DialogDescription>Give the creator a clear reason so the rejection can be understood when they review the result later.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="rejection-reason">Rejection Reason</Label>
              <Textarea id="rejection-reason" value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsRejectOpen(false)}>Cancel</Button>
              <Button type="button" onClick={() => void handleReject()}>Reject Application</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
