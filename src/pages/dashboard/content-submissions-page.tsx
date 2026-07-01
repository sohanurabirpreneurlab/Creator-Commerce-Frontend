import { useEffect, useState } from "react";
import { ExternalLink, RefreshCcw, Search } from "lucide-react";
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
import { useAuth } from "@/hooks/use-auth";
import { getMyContentSubmissions } from "@/lib/campaign-api";
import type {
  ContentSubmissionStatus,
  CreatorContentSubmission,
} from "@/types/content-submission";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatDate(value: string | null) {
  if (!value) {
    return "Not set";
  }

  return new Date(value).toLocaleString();
}

function truncateText(value: string | null, length = 70) {
  if (!value) {
    return "No caption";
  }

  return value.length > length ? `${value.slice(0, length)}...` : value;
}

export function ContentSubmissionsPage() {
  const { token } = useAuth();
  const [submissions, setSubmissions] = useState<CreatorContentSubmission[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContentSubmissionStatus | "">("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] =
    useState<CreatorContentSubmission | null>(null);

  async function loadSubmissions() {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await getMyContentSubmissions(token, {
        page: 1,
        limit: 20,
        search: search.trim() || undefined,
        status: statusFilter || undefined,
      });
      setSubmissions(result.data);
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

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [token, search, statusFilter]);

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Creator Deliverable Review
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
              Content Submissions
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Review the current state of each seeded content submission, along
              with any feedback that would normally come from a brand review flow.
            </p>
          </div>

          <Button type="button" variant="outline" className="gap-2" onClick={() => void loadSubmissions()}>
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
              placeholder="Search by campaign, brand, or caption..."
            />
          </div>

          <select
            className="flex h-12 rounded-full border border-slate-200 bg-white px-4 text-sm text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as ContentSubmissionStatus | "")
            }
          >
            <option value="">All statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
            <option value="CHANGE_REQUESTED">Change Requested</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>

        {errorMessage ? (
          <p className="mt-5 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </p>
        ) : null}
      </Card>

      {isLoading ? <TableLoadingState message="Loading content submissions..." /> : null}

      {!isLoading && submissions.length === 0 ? (
        <DataTableEmptyState
          title="No content submissions found"
          description="Content submissions will appear here once campaign deliverables are prepared for review."
        />
      ) : null}

      {!isLoading && submissions.length > 0 ? (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-6 py-4">Campaign</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Platform</th>
                  <th className="px-6 py-4">Caption Preview</th>
                  <th className="px-6 py-4">Content URL</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted At</th>
                  <th className="px-6 py-4">Reviewed At</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="px-6 py-4 font-semibold text-foreground">
                      {submission.campaign.title}
                    </td>
                    <td className="px-6 py-4">{submission.brand.name}</td>
                    <td className="px-6 py-4">{submission.platform || "Not set"}</td>
                    <td className="px-6 py-4">{truncateText(submission.caption)}</td>
                    <td className="px-6 py-4">
                      {submission.contentUrl ? (
                        <a
                          href={submission.contentUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sky-700 underline underline-offset-4"
                        >
                          Open link
                        </a>
                      ) : (
                        "No URL"
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={submission.status} />
                    </td>
                    <td className="px-6 py-4">{formatDate(submission.submittedAt)}</td>
                    <td className="px-6 py-4">{formatDate(submission.reviewedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-2">
                        {submission.contentUrl ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => window.open(submission.contentUrl ?? "", "_blank", "noopener,noreferrer")}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                          </Button>
                        ) : null}
                        <Button
                          type="button"
                          onClick={() => setSelectedSubmission(submission)}
                        >
                          View Details
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

      <Dialog
        open={selectedSubmission !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedSubmission(null);
          }
        }}
      >
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              Review the full submission caption, review timestamps, and any
              review comment returned by the backend.
            </DialogDescription>
          </DialogHeader>

          {selectedSubmission ? (
            <div className="grid gap-4 text-sm text-slate-700">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-semibold text-foreground">
                  {selectedSubmission.campaign.title}
                </p>
                <p className="mt-1 text-slate-600">{selectedSubmission.brand.name}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Caption
                </p>
                <p className="mt-2 leading-7">
                  {selectedSubmission.caption || "No caption provided."}
                </p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                  Review Comment
                </p>
                <p className="mt-2 leading-7">
                  {selectedSubmission.reviewComment || "No review comment yet."}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
