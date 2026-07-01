import { useEffect, useState } from "react";
import { Eye, RefreshCcw, Search, Users } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { getAdminCreators, updateAdminCreatorVerification } from "@/lib/admin-api";
import type { CreatorListItem, CreatorVerificationStatus } from "@/types/creator";
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

const VERIFICATION_OPTIONS: CreatorVerificationStatus[] = [
  "PENDING",
  "VERIFIED",
  "REJECTED",
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export function CreatorsPage() {
  const { token, user } = useAuth();
  const [creators, setCreators] = useState<CreatorListItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CreatorVerificationStatus | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedCreator, setSelectedCreator] = useState<CreatorListItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  async function loadCreators() {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getAdminCreators(token, {
        page: 1,
        limit: 100,
        search: search.trim() || undefined,
        verificationStatus: statusFilter === "ALL" ? undefined : statusFilter,
      });
      setCreators(response.data);
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
      void loadCreators();
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [token, search, statusFilter]);

  const handleUpdateVerification = async (
    creator: CreatorListItem,
    verificationStatus: CreatorVerificationStatus,
  ) => {
    if (!token) {
      return;
    }

    try {
      const updatedCreator = await updateAdminCreatorVerification(token, creator.id, {
        verificationStatus,
      });

      setCreators((currentCreators) =>
        currentCreators.map((item) =>
          item.id === creator.id
            ? { ...item, verificationStatus: updatedCreator.verificationStatus }
            : item,
        ),
      );
      setSuccessMessage("Creator verification status updated successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  if (user?.role !== "SUPER_ADMIN") {
    return (
      <DataTableEmptyState
        title="Access denied"
        description="Creator oversight is available only for super admins."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
              <Users className="h-4 w-4" />
              Super Admin Creator Oversight
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              Creators
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Review creator profiles, inspect category and location data, and update verification status directly from the table.
            </p>
          </div>

          <Button type="button" variant="outline" className="gap-2" onClick={() => void loadCreators()}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by display name, email, or category..."
              className="pl-11"
            />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as CreatorVerificationStatus | "ALL")} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm">
            <option value="ALL">All verification states</option>
            {VERIFICATION_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {successMessage ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p> : null}
        {errorMessage ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</p> : null}
      </Card>

      {isLoading ? (
        <TableLoadingState message="Loading creators..." />
      ) : creators.length === 0 ? (
        <DataTableEmptyState
          title="No creators found"
          description="Try a different search or verification filter."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-6 py-4">Display Name</th>
                  <th className="px-6 py-4">User Email</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4">Social Accounts</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {creators.map((creator) => (
                  <tr key={creator.id}>
                    <td className="px-6 py-4 font-semibold text-foreground">{creator.displayName}</td>
                    <td className="px-6 py-4">{creator.userEmail}</td>
                    <td className="px-6 py-4">{creator.category || "Not set"}</td>
                    <td className="px-6 py-4">{creator.location || "Not set"}</td>
                    <td className="px-6 py-4"><StatusBadge status={creator.verificationStatus} /></td>
                    <td className="px-6 py-4">{creator.socialAccountsCount}</td>
                    <td className="px-6 py-4">{formatDate(creator.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <Button type="button" variant="outline" className="justify-start gap-2" onClick={() => { setSelectedCreator(creator); setIsDetailsOpen(true); }}>
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <select value={creator.verificationStatus} onChange={(event) => void handleUpdateVerification(creator, event.target.value as CreatorVerificationStatus)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-foreground">
                          {VERIFICATION_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
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
            <DialogTitle>{selectedCreator?.displayName ?? "Creator details"}</DialogTitle>
            <DialogDescription>Review the creator profile summary, bio, and verification state.</DialogDescription>
          </DialogHeader>
          {selectedCreator ? (
            <div className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
              <Card className="p-5">
                <p><span className="font-bold text-foreground">Email:</span> {selectedCreator.userEmail}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Category:</span> {selectedCreator.category || "Not set"}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Location:</span> {selectedCreator.location || "Not set"}</p>
              </Card>
              <Card className="p-5">
                <p><span className="font-bold text-foreground">Verification:</span> <span className="ml-2"><StatusBadge status={selectedCreator.verificationStatus} /></span></p>
                <p className="mt-3"><span className="font-bold text-foreground">Social Accounts:</span> {selectedCreator.socialAccountsCount}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Bio:</span> {selectedCreator.bio || "No bio provided."}</p>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
