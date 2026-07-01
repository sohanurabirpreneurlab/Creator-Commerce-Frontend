import { useEffect, useState } from "react";
import { Eye, Plus, RefreshCcw, Search, UsersRound } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  createBrandAmbassador,
  getBrandAmbassadors,
  removeBrandAmbassador,
  updateBrandAmbassador,
  updateBrandAmbassadorStatus,
} from "@/lib/brand-api";
import {
  getAdminBrandAmbassadors,
  updateAdminBrandAmbassadorStatus,
} from "@/lib/admin-api";
import type {
  BrandAmbassador,
  BrandAmbassadorStatus,
  BrandAmbassadorType,
} from "@/types/brand-ambassador";
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

const AMBASSADOR_TYPES: BrandAmbassadorType[] = [
  "LONG_TERM",
  "CAMPAIGN_BASED",
  "EVENT_BASED",
  "PRODUCT_BASED",
];

const AMBASSADOR_STATUSES: BrandAmbassadorStatus[] = [
  "PENDING",
  "ACTIVE",
  "PAUSED",
  "REMOVED",
  "REJECTED",
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

type AmbassadorFormState = {
  creatorProfileId: string;
  ambassadorType: BrandAmbassadorType;
  notes: string;
};

function toFormState(ambassador?: BrandAmbassador | null): AmbassadorFormState {
  return {
    creatorProfileId: ambassador?.creator.id ?? "",
    ambassadorType: ambassador?.ambassadorType ?? "LONG_TERM",
    notes: ambassador?.notes ?? "",
  };
}

export function AmbassadorsPage() {
  const { token, user } = useAuth();
  const [ambassadors, setAmbassadors] = useState<BrandAmbassador[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BrandAmbassadorStatus | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedAmbassador, setSelectedAmbassador] = useState<BrandAmbassador | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAmbassador, setEditingAmbassador] = useState<BrandAmbassador | null>(null);
  const [formState, setFormState] = useState<AmbassadorFormState>(toFormState());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isBrandManager = user?.role === "BRAND_MANAGER";
  const isSuperAdmin = user?.role === "SUPER_ADMIN";

  async function loadAmbassadors() {
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
        ? await getBrandAmbassadors(token, params)
        : await getAdminBrandAmbassadors(token, params);

      setAmbassadors(response.data);
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
      void loadAmbassadors();
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [token, search, statusFilter, user?.role]);

  const handleOpenCreate = () => {
    setEditingAmbassador(null);
    setFormState(toFormState());
    setIsFormOpen(true);
  };

  const handleOpenEdit = (ambassador: BrandAmbassador) => {
    setEditingAmbassador(ambassador);
    setFormState(toFormState(ambassador));
    setIsFormOpen(true);
  };

  const handleSaveAmbassador = async () => {
    if (!token || !isBrandManager) {
      return;
    }

    setIsSubmitting(true);

    try {
      const savedAmbassador = editingAmbassador
        ? await updateBrandAmbassador(token, editingAmbassador.id, {
            ambassadorType: formState.ambassadorType,
            notes: formState.notes || undefined,
          })
        : await createBrandAmbassador(token, {
            creatorProfileId: formState.creatorProfileId,
            ambassadorType: formState.ambassadorType,
            notes: formState.notes || undefined,
          });

      setAmbassadors((currentAmbassadors) => {
        const alreadyExists = currentAmbassadors.some((item) => item.id === savedAmbassador.id);
        return alreadyExists
          ? currentAmbassadors.map((item) => (item.id === savedAmbassador.id ? savedAmbassador : item))
          : [savedAmbassador, ...currentAmbassadors];
      });

      setSuccessMessage(
        editingAmbassador
          ? "Ambassador updated successfully."
          : "Ambassador added successfully.",
      );
      setIsFormOpen(false);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (
    ambassador: BrandAmbassador,
    nextStatus: BrandAmbassadorStatus,
  ) => {
    if (!token || ambassador.status === nextStatus) {
      return;
    }

    try {
      const updatedAmbassador = isBrandManager
        ? await updateBrandAmbassadorStatus(token, ambassador.id, { status: nextStatus })
        : await updateAdminBrandAmbassadorStatus(token, ambassador.id, { status: nextStatus });

      setAmbassadors((currentAmbassadors) =>
        currentAmbassadors.map((item) =>
          item.id === updatedAmbassador.id ? updatedAmbassador : item,
        ),
      );
      setSuccessMessage("Ambassador status updated successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleRemove = async (ambassador: BrandAmbassador) => {
    if (!token || !isBrandManager) {
      return;
    }

    try {
      const removedAmbassador = await removeBrandAmbassador(token, ambassador.id);
      setAmbassadors((currentAmbassadors) =>
        currentAmbassadors.map((item) =>
          item.id === removedAmbassador.id ? removedAmbassador : item,
        ),
      );
      setSuccessMessage("Ambassador removed from the brand roster.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  if (!isBrandManager && !isSuperAdmin) {
    return (
      <DataTableEmptyState
        title="Access denied"
        description="Brand ambassadors are available only for brand managers and super admins."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
              <UsersRound className="h-4 w-4" />
              Ambassador Desk
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              {isBrandManager ? "Brand Ambassadors" : "Platform Ambassadors"}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              {isBrandManager
                ? "Manage the creator roster attached to your assigned brand, including type, notes, status, and soft removal."
                : "Review ambassador relationships across all brands and update platform-wide roster status when needed."}
            </p>
          </div>

          <div className="flex gap-3">
            {isBrandManager ? (
              <Button type="button" className="gap-2" onClick={handleOpenCreate}>
                <Plus className="h-4 w-4" />
                Add Ambassador
              </Button>
            ) : null}
            <Button type="button" variant="outline" className="gap-2" onClick={() => void loadAmbassadors()}>
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by creator, brand, or email..." className="pl-11" />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as BrandAmbassadorStatus | "ALL")} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm">
            <option value="ALL">All statuses</option>
            {AMBASSADOR_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {isBrandManager ? (
          <p className="mt-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
            If creator search is not available yet for your workflow, enter a creator profile ID directly in the add modal.
          </p>
        ) : null}

        {successMessage ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p> : null}
        {errorMessage ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</p> : null}
      </Card>

      {isLoading ? (
        <TableLoadingState message="Loading ambassadors..." />
      ) : ambassadors.length === 0 ? (
        <DataTableEmptyState title="No ambassadors found" description="Try a different search or status filter." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-6 py-4">Creator</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Source</th>
                  <th className="px-6 py-4">Joined</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {ambassadors.map((ambassador) => (
                  <tr key={ambassador.id}>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{ambassador.creator.displayName}</p>
                      <p className="mt-1 text-xs text-muted">{ambassador.creator.userEmail}</p>
                    </td>
                    <td className="px-6 py-4">{ambassador.brand.name}</td>
                    <td className="px-6 py-4">{ambassador.ambassadorType.replaceAll("_", " ")}</td>
                    <td className="px-6 py-4"><StatusBadge status={ambassador.status} /></td>
                    <td className="px-6 py-4">{ambassador.source.replaceAll("_", " ")}</td>
                    <td className="px-6 py-4">{formatDate(ambassador.joinedAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <Button type="button" variant="outline" className="justify-start gap-2" onClick={() => { setSelectedAmbassador(ambassador); setIsDetailsOpen(true); }}>
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        {isBrandManager ? (
                          <Button type="button" variant="outline" onClick={() => handleOpenEdit(ambassador)}>
                            Edit
                          </Button>
                        ) : null}
                        <select value={ambassador.status} onChange={(event) => void handleStatusChange(ambassador, event.target.value as BrandAmbassadorStatus)} className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-foreground">
                          {AMBASSADOR_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {status.replaceAll("_", " ")}
                            </option>
                          ))}
                        </select>
                        {isBrandManager ? (
                          <Button type="button" variant="outline" onClick={() => void handleRemove(ambassador)}>
                            Remove
                          </Button>
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
            <DialogTitle>{selectedAmbassador?.creator.displayName ?? "Ambassador details"}</DialogTitle>
            <DialogDescription>Review the brand relationship, roster state, and notes.</DialogDescription>
          </DialogHeader>
          {selectedAmbassador ? (
            <div className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
              <Card className="p-5">
                <p><span className="font-bold text-foreground">Brand:</span> {selectedAmbassador.brand.name}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Creator Email:</span> {selectedAmbassador.creator.userEmail}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Type:</span> {selectedAmbassador.ambassadorType.replaceAll("_", " ")}</p>
              </Card>
              <Card className="p-5">
                <p><span className="font-bold text-foreground">Status:</span> <span className="ml-2"><StatusBadge status={selectedAmbassador.status} /></span></p>
                <p className="mt-3"><span className="font-bold text-foreground">Joined:</span> {formatDate(selectedAmbassador.joinedAt)}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Notes:</span> {selectedAmbassador.notes || "No notes yet."}</p>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[95vw] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAmbassador ? "Edit ambassador" : "Add ambassador"}</DialogTitle>
            <DialogDescription>
              This form stays intentionally simple: creator profile ID, ambassador type, and notes are enough for the current roster workflow.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            {!editingAmbassador ? (
              <div className="grid gap-2">
                <Label htmlFor="creator-profile-id">Creator Profile ID</Label>
                <Input id="creator-profile-id" value={formState.creatorProfileId} onChange={(event) => setFormState((currentState) => ({ ...currentState, creatorProfileId: event.target.value }))} />
              </div>
            ) : null}
            <div className="grid gap-2">
              <Label htmlFor="ambassador-type">Ambassador Type</Label>
              <select id="ambassador-type" value={formState.ambassadorType} onChange={(event) => setFormState((currentState) => ({ ...currentState, ambassadorType: event.target.value as BrandAmbassadorType }))} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm">
                {AMBASSADOR_TYPES.map((ambassadorType) => (
                  <option key={ambassadorType} value={ambassadorType}>
                    {ambassadorType.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="ambassador-notes">Notes</Label>
              <Textarea id="ambassador-notes" value={formState.notes} onChange={(event) => setFormState((currentState) => ({ ...currentState, notes: event.target.value }))} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="button" onClick={() => void handleSaveAmbassador()} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingAmbassador ? "Save Changes" : "Add Ambassador"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
