import { useEffect, useState } from "react";
import { ExternalLink, Eye, RefreshCcw, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  approveBrandContentSubmission,
  getBrandContentSubmissions,
  rejectBrandContentSubmission,
  requestBrandContentChanges,
} from "@/lib/brand-api";
import {
  getAdminContentSubmissions,
  updateAdminContentSubmissionStatus,
} from "@/lib/admin-api";
import type {
  ContentSubmissionStatus,
  ReviewerContentSubmission,
} from "@/types/content-submission";
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

const CONTENT_STATUSES: Array<ContentSubmissionStatus | "ALL"> = [
  "ALL",
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "CHANGE_REQUESTED",
  "REJECTED",
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : "Not set";
}

export function ContentApprovalsPage() {
  const { token, user } = useAuth();
  const [submissions, setSubmissions] = useState<ReviewerContentSubmission[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentSubmissionStatus | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<ReviewerContentSubmission | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<"reject" | "change" | "admin-status">("reject");
  const [reviewComment, setReviewComment] = useState("");
  const [adminStatus, setAdminStatus] = useState<ContentSubmissionStatus>("APPROVED");

  const isBrandManager = user?.role === "BRAND_MANAGER";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  async function loadSubmissions() {
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
        ? await getBrandContentSubmissions(token, params)
        : await getAdminContentSubmissions(token, params);

        console.log('result',response);
        
      setSubmissions(response.data);
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
      void loadSubmissions();
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [token, search, statusFilter, user?.role]);

  const handleApprove = async (submission: ReviewerContentSubmission) => {
    if (!token) {
      return;
    }

    try {
      const updatedSubmission = isBrandManager
        ? await approveBrandContentSubmission(token, submission.id)
        : await updateAdminContentSubmissionStatus(token, submission.id, {
            status: "APPROVED",
          });

      setSubmissions((currentSubmissions) =>
        currentSubmissions.map((item) =>
          item.id === submission.id
            ? { ...item, status: updatedSubmission.status, reviewedAt: updatedSubmission.reviewedAt, reviewComment: updatedSubmission.reviewComment }
            : item,
        ),
      );
      setSuccessMessage("Content submission approved successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleSubmitReview = async () => {
    if (!token || !selectedSubmission) {
      return;
    }

    try {
      const updatedSubmission =
        reviewAction === "reject"
          ? isBrandManager
            ? await rejectBrandContentSubmission(token, selectedSubmission.id, { reviewComment })
            : await updateAdminContentSubmissionStatus(token, selectedSubmission.id, {
                status: "REJECTED",
                reviewComment,
              })
          : reviewAction === "change"
            ? await requestBrandContentChanges(token, selectedSubmission.id, { reviewComment })
            : await updateAdminContentSubmissionStatus(token, selectedSubmission.id, {
                status: adminStatus,
                reviewComment,
              });

      setSubmissions((currentSubmissions) =>
        currentSubmissions.map((item) =>
          item.id === selectedSubmission.id
            ? {
                ...item,
                status: updatedSubmission.status,
                reviewedAt: updatedSubmission.reviewedAt,
                reviewComment: updatedSubmission.reviewComment,
              }
            : item,
        ),
      );
      setSuccessMessage("Content submission updated successfully.");
      setIsReviewOpen(false);
      setReviewComment("");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  if (!isBrandManager && !isSuperAdmin) {
    return (
      <DataTableEmptyState
        title="Access denied"
        description="Content approval is available only for brand managers and super admins."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Content Approvals
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              {isBrandManager
                ? "Review content tied to your brand campaigns and approve, reject, or request changes with clear review comments."
                : "Inspect content submissions across the platform and override status when necessary."}
            </p>
          </div>
          <Button type="button" variant="outline" className="gap-2" onClick={() => void loadSubmissions()}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by creator, campaign, brand, or caption..." className="pl-11" />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as ContentSubmissionStatus | "ALL")} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm">
            {CONTENT_STATUSES.map((status) => (
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
        <TableLoadingState message="Loading content submissions..." />
      ) : submissions.length === 0 ? (
        <DataTableEmptyState title="No content submissions found" description="Try a different search or review state filter." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-6 py-4">Creator</th>
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Caption Preview</th>
                  <th className="px-6 py-4">Content URL</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Reviewed</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{submission.creator.displayName}</p>
                      <p className="mt-1 text-xs text-muted">{submission.creator.userEmail}</p>
                    </td>
                    <td className="px-6 py-4">{submission.campaign.title}</td>
                    <td className="px-6 py-4">{submission.brand.name}</td>
                    <td className="px-6 py-4">{submission.platform || "Not set"}</td>
                    <td className="px-6 py-4 max-w-xs truncate">{submission.caption || "No caption"}</td>
                    <td className="px-6 py-4">
                      {submission.contentUrl ? (
                        <a href={submission.contentUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sky-600 hover:underline">
                          Open
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        "Not set"
                      )}
                    </td>
                    <td className="px-6 py-4"><StatusBadge status={submission.status} /></td>
                    <td className="px-6 py-4">{formatDate(submission.submittedAt)}</td>
                    <td className="px-6 py-4">{formatDate(submission.reviewedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" className="justify-start gap-2" onClick={() => { setSelectedSubmission(submission); setIsDetailsOpen(true); }}>
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button type="button" variant="outline" onClick={() => void handleApprove(submission)}>
                          Approve
                        </Button>
                        <Button type="button" variant="outline" onClick={() => { setSelectedSubmission(submission); setReviewAction("reject"); setReviewComment(""); setIsReviewOpen(true); }}>
                          Reject
                        </Button>
                        {isBrandManager ? (
                          <Button type="button" variant="outline" onClick={() => { setSelectedSubmission(submission); setReviewAction("change"); setReviewComment(""); setIsReviewOpen(true); }}>
                            Request Changes
                          </Button>
                        ) : (
                          <Button type="button" variant="outline" onClick={() => { setSelectedSubmission(submission); setReviewAction("admin-status"); setReviewComment(submission.reviewComment || ""); setAdminStatus(submission.status); setIsReviewOpen(true); }}>
                            Override Status
                          </Button>
                        )}
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
            <DialogTitle>{selectedSubmission?.campaign.title ?? "Submission details"}</DialogTitle>
            <DialogDescription>Review the caption, link, and latest feedback without leaving the dashboard.</DialogDescription>
          </DialogHeader>
          {selectedSubmission ? (
            <div className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
              <Card className="p-5">
                <p><span className="font-bold text-foreground">Creator:</span> {selectedSubmission.creator.displayName}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Caption:</span> {selectedSubmission.caption || "No caption."}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Content URL:</span> {selectedSubmission.contentUrl || "Not set"}</p>
              </Card>
              <Card className="p-5">
                <p><span className="font-bold text-foreground">Status:</span> <span className="ml-2"><StatusBadge status={selectedSubmission.status} /></span></p>
                <p className="mt-3"><span className="font-bold text-foreground">Review Comment:</span> {selectedSubmission.reviewComment || "No review comment yet."}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Submitted:</span> {formatDate(selectedSubmission.submittedAt)}</p>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="w-[95vw] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {reviewAction === "reject"
                ? "Reject content submission"
                : reviewAction === "change"
                  ? "Request content changes"
                  : "Override content status"}
            </DialogTitle>
            <DialogDescription>
              Keep review feedback explicit so creators understand what changed and why.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            {reviewAction === "admin-status" ? (
              <div className="grid gap-2">
                <Label htmlFor="admin-status-select">Status</Label>
                <select id="admin-status-select" value={adminStatus} onChange={(event) => setAdminStatus(event.target.value as ContentSubmissionStatus)} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm">
                  {CONTENT_STATUSES.filter((status) => status !== "ALL").map((status) => (
                    <option key={status} value={status}>
                      {status.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor="review-comment">Review Comment</Label>
              <Textarea id="review-comment" value={reviewComment} onChange={(event) => setReviewComment(event.target.value)} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsReviewOpen(false)}>Cancel</Button>
              <Button type="button" onClick={() => void handleSubmitReview()}>
                Save Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
