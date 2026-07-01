import { useEffect, useMemo, useState } from "react";
import { Eye, FolderKanban, Plus, RefreshCcw, Save, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  createBrandCampaign,
  getBrandCampaigns,
  updateBrandCampaign,
  updateBrandCampaignStatus,
} from "@/lib/brand-api";
import { getAdminCampaigns, updateAdminCampaignStatus } from "@/lib/admin-api";
import type {
  CampaignObjective,
  CampaignStatus,
  ManagedCampaign,
} from "@/types/campaign";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
import { TableLoadingState } from "@/components/dashboard/table-loading-state";
import { RoleBadge } from "@/components/dashboard/role-badge";
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
import type { UserRole } from "@/types/auth";

const CAMPAIGN_OBJECTIVES: CampaignObjective[] = [
  "CLICK",
  "LEAD",
  "REGISTRATION",
  "PURCHASE",
  "RECHARGE",
  "APP_INSTALL",
];

const CAMPAIGN_STATUSES: CampaignStatus[] = [
  "DRAFT",
  "PENDING_APPROVAL",
  "ACTIVE",
  "PAUSED",
  "COMPLETED",
  "CANCELLED",
  "REJECTED",
];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatDate(value: string | null) {
  return value ? new Date(value).toLocaleDateString() : "Not set";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

type CampaignFormState = {
  title: string;
  description: string;
  objective: CampaignObjective;
  budget: string;
  destinationUrl: string;
  startDate: string;
  endDate: string;
};

function toFormState(campaign?: ManagedCampaign | null): CampaignFormState {
  return {
    title: campaign?.title ?? "",
    description: campaign?.description ?? "",
    objective: campaign?.objective ?? "CLICK",
    budget: campaign ? String(campaign.budget) : "",
    destinationUrl: campaign?.destinationUrl ?? "",
    startDate: campaign?.startDate ? campaign.startDate.slice(0, 10) : "",
    endDate: campaign?.endDate ? campaign.endDate.slice(0, 10) : "",
  };
}

export function CampaignsPage() {
  const { token, user } = useAuth();
  const [campaigns, setCampaigns] = useState<ManagedCampaign[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CampaignStatus | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<ManagedCampaign | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<ManagedCampaign | null>(null);
  const [formState, setFormState] = useState<CampaignFormState>(toFormState());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const role = user?.role ?? "CREATOR";
  const isBrandManager = role === "BRAND_MANAGER";
  const isSuperAdmin = role === "SUPER_ADMIN";

  async function loadCampaigns(searchValue: string, statusValue: CampaignStatus | "ALL") {
    if (!token || (!isBrandManager && !isSuperAdmin)) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const params = {
        search: searchValue.trim() || undefined,
        status: statusValue === "ALL" ? undefined : statusValue,
        page: 1,
        limit: 50,
      };

      const response = isBrandManager
        ? await getBrandCampaigns(token, params)
        : await getAdminCampaigns(token, params);

      setCampaigns(response.data);
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
      void loadCampaigns(search, statusFilter);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [token, search, statusFilter, role]);

  const pageTitle = useMemo(
    () => (isBrandManager ? "Brand Campaigns" : "Platform Campaigns"),
    [isBrandManager],
  );

  const handleOpenCreate = () => {
    setEditingCampaign(null);
    setFormState(toFormState());
    setIsFormOpen(true);
  };

  const handleOpenEdit = (campaign: ManagedCampaign) => {
    setEditingCampaign(campaign);
    setFormState(toFormState(campaign));
    setIsFormOpen(true);
  };

  const handleSaveCampaign = async () => {
    if (!token) {
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        title: formState.title,
        description: formState.description || undefined,
        objective: formState.objective,
        budget: formState.budget === "" ? 0 : Number(formState.budget),
        destinationUrl: formState.destinationUrl || undefined,
        startDate: formState.startDate || undefined,
        endDate: formState.endDate || undefined,
      };

      if (editingCampaign && isBrandManager) {
        await updateBrandCampaign(token, editingCampaign.id, payload);
      } else {
        await createBrandCampaign(token, payload);
      }

      setSuccessMessage(
        editingCampaign
          ? "Campaign updated successfully."
          : "Campaign created successfully.",
      );
      setIsFormOpen(false);
      await loadCampaigns(search, statusFilter);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (
    campaign: ManagedCampaign,
    nextStatus: CampaignStatus,
  ) => {
    if (!token || campaign.status === nextStatus) {
      return;
    }

    try {
      if (isBrandManager) {
        await updateBrandCampaignStatus(token, campaign.id, { status: nextStatus });
      } else {
        await updateAdminCampaignStatus(token, campaign.id, { status: nextStatus });
      }
      setSuccessMessage("Campaign status updated successfully.");
      await loadCampaigns(search, statusFilter);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  if (!isBrandManager && !isSuperAdmin) {
    return (
      <DataTableEmptyState
        title="Access denied"
        description="Campaign management is available only for brand managers and super admins."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
              <FolderKanban className="h-4 w-4" />
              Campaign Workspace
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {pageTitle}
              </h1>
              <RoleBadge role={role as UserRole} />
            </div>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              {isBrandManager
                ? "Create, update, and move your assigned brand campaigns through the current approval-ready workflow."
                : "Review every campaign across the platform and control final campaign status from one place."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {isBrandManager ? (
              <Button type="button" className="gap-2" onClick={handleOpenCreate}>
                <Plus className="h-4 w-4" />
                Create Campaign
              </Button>
            ) : null}
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => void loadCampaigns(search, statusFilter)}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by campaign title or brand name..."
              className="pl-11"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as CampaignStatus | "ALL")}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm"
          >
            <option value="ALL">All statuses</option>
            {CAMPAIGN_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        {successMessage ? (
          <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
        ) : null}
        {errorMessage ? (
          <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
            {errorMessage}
          </p>
        ) : null}
      </Card>

      {isLoading ? (
        <TableLoadingState message="Loading campaigns..." />
      ) : campaigns.length === 0 ? (
        <DataTableEmptyState
          title="No campaigns found"
          description="Try a different search or status filter, or create the first campaign for this brand."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Brand</th>
                  <th className="px-6 py-4">Objective</th>
                  <th className="px-6 py-4">Budget</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Start Date</th>
                  <th className="px-6 py-4">End Date</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="align-top">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">{campaign.title}</p>
                      <p className="mt-1 max-w-xs text-xs text-muted">
                        {campaign.description || "No description provided yet."}
                      </p>
                    </td>
                    <td className="px-6 py-4">{campaign.brand.name}</td>
                    <td className="px-6 py-4">{campaign.objective.replaceAll("_", " ")}</td>
                    <td className="px-6 py-4">{formatCurrency(campaign.budget)}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={campaign.status} />
                    </td>
                    <td className="px-6 py-4">{formatDate(campaign.startDate)}</td>
                    <td className="px-6 py-4">{formatDate(campaign.endDate)}</td>
                    <td className="px-6 py-4">{formatDate(campaign.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            className="justify-start gap-2"
                            onClick={() => {
                              setSelectedCampaign(campaign);
                              setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>

                        {isBrandManager ? (
                          <Button
                            type="button"
                            variant="outline"
                            className="justify-start gap-2"
                            onClick={() => handleOpenEdit(campaign)}
                          >
                            <Save className="h-4 w-4" />
                            Edit
                          </Button>
                        ) : null}

                        <select
                          value={campaign.status}
                          onChange={(event) =>
                            void handleStatusChange(
                              campaign,
                              event.target.value as CampaignStatus,
                            )
                          }
                          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-foreground"
                        >
                          {CAMPAIGN_STATUSES.map((status) => (
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
        <DialogContent className="w-[95vw] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCampaign?.title ?? "Campaign details"}</DialogTitle>
            <DialogDescription>
              Review the current campaign details, dates, and brand context without leaving the table.
            </DialogDescription>
          </DialogHeader>

          {selectedCampaign ? (
            <div className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
              <Card className="p-5">
                <h3 className="font-bold text-foreground">Campaign</h3>
                <dl className="mt-3 space-y-2">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Objective</dt>
                    <dd>{selectedCampaign.objective.replaceAll("_", " ")}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Budget</dt>
                    <dd>{formatCurrency(selectedCampaign.budget)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Destination URL</dt>
                    <dd className="break-all">{selectedCampaign.destinationUrl || "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Description</dt>
                    <dd>{selectedCampaign.description || "No description provided."}</dd>
                  </div>
                </dl>
              </Card>

              <Card className="p-5">
                <h3 className="font-bold text-foreground">Brand & Timing</h3>
                <dl className="mt-3 space-y-2">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Brand</dt>
                    <dd>{selectedCampaign.brand.name}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Industry</dt>
                    <dd>{selectedCampaign.brand.industry || "Not set"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Start</dt>
                    <dd>{formatDate(selectedCampaign.startDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">End</dt>
                    <dd>{formatDate(selectedCampaign.endDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.14em] text-slate-500">Status</dt>
                    <dd className="pt-1">
                      <StatusBadge status={selectedCampaign.status} />
                    </dd>
                  </div>
                </dl>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[95vw] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCampaign ? "Edit campaign" : "Create campaign"}</DialogTitle>
            <DialogDescription>
              The form stays intentionally close to the backend campaign shape so it is easy to review and maintain.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="campaign-title">Title</Label>
              <Input
                id="campaign-title"
                value={formState.title}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    title: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="campaign-description">Description</Label>
              <Textarea
                id="campaign-description"
                value={formState.description}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    description: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="campaign-objective">Objective</Label>
                <select
                  id="campaign-objective"
                  value={formState.objective}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      objective: event.target.value as CampaignObjective,
                    }))
                  }
                  className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm"
                >
                  {CAMPAIGN_OBJECTIVES.map((objective) => (
                    <option key={objective} value={objective}>
                      {objective.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="campaign-budget">Budget</Label>
                <Input
                  id="campaign-budget"
                  type="number"
                  min="0"
                  value={formState.budget}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      budget: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="campaign-destination">Destination URL</Label>
              <Input
                id="campaign-destination"
                value={formState.destinationUrl}
                onChange={(event) =>
                  setFormState((currentState) => ({
                    ...currentState,
                    destinationUrl: event.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="campaign-start-date">Start Date</Label>
                <Input
                  id="campaign-start-date"
                  type="date"
                  value={formState.startDate}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      startDate: event.target.value,
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="campaign-end-date">End Date</Label>
                <Input
                  id="campaign-end-date"
                  type="date"
                  value={formState.endDate}
                  onChange={(event) =>
                    setFormState((currentState) => ({
                      ...currentState,
                      endDate: event.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsFormOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => void handleSaveCampaign()}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : editingCampaign ? "Save Changes" : "Create Campaign"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
