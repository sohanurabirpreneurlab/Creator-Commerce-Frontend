import { useEffect, useState } from "react";
import {
  BadgeDollarSign,
  CalendarRange,
  LoaderCircle,
  RefreshCcw,
  Search,
  Target,
} from "lucide-react";
import { ApplyCampaignModal } from "@/components/dashboard/campaigns/apply-campaign-modal";
import { CampaignDetailsModal } from "@/components/dashboard/campaigns/campaign-details-modal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import {
  applyToCampaign,
  getAvailableCampaigns,
  getCreatorCampaignDetails,
} from "@/lib/campaign-api";
import type {
  ApplyCampaignPayload,
  AvailableCampaign,
  CreatorApplication,
} from "@/types/campaign";

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function buildBrandInitials(brandName: string) {
  return brandName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatBudget(budget: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(budget);
}

function formatDateRange(startDate: string | null, endDate: string | null) {
  if (!startDate && !endDate) {
    return "Dates will be shared later";
  }

  const start = startDate ? new Date(startDate).toLocaleDateString() : "Open start";
  const end = endDate ? new Date(endDate).toLocaleDateString() : "Open end";
  return `${start} to ${end}`;
}

function mapApplicationToCampaignSummary(application: CreatorApplication) {
  return {
    id: application.id,
    status: application.status,
  };
}

export function AvailableCampaignsPage() {
  const { token } = useAuth();
  const [campaigns, setCampaigns] = useState<AvailableCampaign[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<AvailableCampaign | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDetailsLoading, setIsDetailsLoading] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [applyingCampaign, setApplyingCampaign] = useState<AvailableCampaign | null>(
    null,
  );
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [applyErrorMessage, setApplyErrorMessage] = useState<string | null>(null);

  const hasCreatorProfileError =
    errorMessage?.toLowerCase().includes("creator profile not found") ?? false;

  async function loadCampaigns(searchValue: string) {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getAvailableCampaigns(token, {
        search: searchValue.trim() || undefined,
        page: 1,
        limit: 12,
      });

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

    // Debounced backend search keeps the current page responsive while still
    // using the API as the source of truth for filtering and future pagination.
    const timeoutId = window.setTimeout(() => {
      void loadCampaigns(search);
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [token, search]);

  const handleRefresh = async () => {
    setSuccessMessage(null);
    await loadCampaigns(search);
  };

  const handleOpenDetails = async (campaign: AvailableCampaign) => {
    if (!token) {
      return;
    }

    setSelectedCampaign(campaign);
    setIsDetailsModalOpen(true);
    setIsDetailsLoading(true);

    try {
      const detail = await getCreatorCampaignDetails(token, campaign.id);
      setSelectedCampaign(detail);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsDetailsLoading(false);
    }
  };

  const handleOpenApplyModal = (campaign: AvailableCampaign) => {
    setApplyingCampaign(campaign);
    setApplyErrorMessage(null);
    setIsApplyModalOpen(true);
  };

  const handleApplyToCampaign = async (payload: ApplyCampaignPayload) => {
    if (!token || !applyingCampaign) {
      return;
    }

    setIsSubmittingApplication(true);
    setApplyErrorMessage(null);

    try {
      const result = await applyToCampaign(token, applyingCampaign.id, payload);

      // Update the in-memory campaign list immediately so the creator sees the
      // "Applied" state without waiting for a full page refresh.
      setCampaigns((currentCampaigns) =>
        currentCampaigns.map((campaign) =>
          campaign.id === applyingCampaign.id
            ? {
                ...campaign,
                hasApplied: true,
                application: mapApplicationToCampaignSummary(result.application),
              }
            : campaign,
        ),
      );

      setSelectedCampaign((currentCampaign) =>
        currentCampaign && currentCampaign.id === applyingCampaign.id
          ? {
              ...currentCampaign,
              hasApplied: true,
              application: mapApplicationToCampaignSummary(result.application),
            }
          : currentCampaign,
      );

      setSuccessMessage("Campaign application submitted successfully.");
      setIsApplyModalOpen(false);
      setApplyingCampaign(null);
    } catch (error) {
      const message = getErrorMessage(error);
      setApplyErrorMessage(message);

      if (message.toLowerCase().includes("already applied")) {
        setCampaigns((currentCampaigns) =>
          currentCampaigns.map((campaign) =>
            campaign.id === applyingCampaign.id
              ? {
                  ...campaign,
                  hasApplied: true,
                  application: campaign.application ?? {
                    id: `existing-${campaign.id}`,
                    status: "APPLIED",
                  },
                }
            : campaign,
          ),
        );
        setSelectedCampaign((currentCampaign) =>
          currentCampaign && currentCampaign.id === applyingCampaign.id
            ? {
                ...currentCampaign,
                hasApplied: true,
                application: currentCampaign.application ?? {
                  id: `existing-${currentCampaign.id}`,
                  status: "APPLIED",
                },
              }
            : currentCampaign,
        );
        setSuccessMessage(
          "This campaign was already applied to, so the page has been synced to the latest state.",
        );
        setIsApplyModalOpen(false);
      }
    } finally {
      setIsSubmittingApplication(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
              Creator Campaign Discovery
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">
              Available Campaigns
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Browse active campaigns, review details, and apply directly from
              your creator dashboard. Search runs through the backend so title
              and brand filters stay correct as data grows.
            </p>
          </div>

          <Button type="button" variant="outline" className="gap-2" onClick={() => void handleRefresh()}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-11"
              placeholder="Search by campaign title or brand name..."
            />
          </div>
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

      {hasCreatorProfileError ? (
        <Card className="p-8">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            Creator profile required
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            Please complete your creator profile before applying to campaigns.
          </p>
        </Card>
      ) : null}

      {isLoading ? (
        <Card className="p-8">
          <div className="flex items-center gap-3 text-slate-600">
            <LoaderCircle className="h-5 w-5 animate-spin" />
            <span className="text-sm font-medium">Loading campaigns...</span>
          </div>
        </Card>
      ) : null}

      {!isLoading && !hasCreatorProfileError && campaigns.length === 0 ? (
        <Card className="p-8">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground">
            No campaigns found
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted">
            {search.trim()
              ? "Try a different search term for campaign title or brand name."
              : "There are no active campaigns available for creators right now."}
          </p>
        </Card>
      ) : null}

      {!isLoading && !hasCreatorProfileError && campaigns.length > 0 ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-6">
              <div className="flex items-start gap-4">
                {campaign.brand.logoUrl ? (
                  <img
                    src={campaign.brand.logoUrl}
                    alt={campaign.brand.name}
                    className="h-14 w-14 rounded-2xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-sm font-extrabold text-slate-700">
                    {buildBrandInitials(campaign.brand.name)}
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                    {campaign.brand.name}
                  </p>
                  <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-foreground">
                    {campaign.title}
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    {campaign.brand.industry || "Industry not specified"}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-slate-700">
                  <Target className="h-3.5 w-3.5" />
                  {campaign.objective.replaceAll("_", " ")}
                </span>

                {campaign.hasApplied && campaign.application ? (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.08em] text-emerald-700">
                    {campaign.application.status}
                  </span>
                ) : null}
              </div>

              <p className="mt-5 text-sm leading-7 text-muted">
                {campaign.description || "No campaign description is available yet."}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <BadgeDollarSign className="h-4 w-4" />
                    Budget
                  </div>
                  <p className="mt-2 text-base font-bold text-foreground">
                    {formatBudget(campaign.budget)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <CalendarRange className="h-4 w-4" />
                    Date Range
                  </div>
                  <p className="mt-2 text-base font-bold text-foreground">
                    {formatDateRange(campaign.startDate, campaign.endDate)}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => void handleOpenDetails(campaign)}
                >
                  Details
                </Button>
                <Button
                  type="button"
                  disabled={campaign.hasApplied}
                  onClick={() => handleOpenApplyModal(campaign)}
                >
                  {campaign.hasApplied ? "Applied" : "Apply"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      <CampaignDetailsModal
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        campaign={selectedCampaign}
        isLoading={isDetailsLoading}
        onApply={(campaign) => {
          setIsDetailsModalOpen(false);
          handleOpenApplyModal(campaign);
        }}
      />

      <ApplyCampaignModal
        open={isApplyModalOpen}
        onOpenChange={setIsApplyModalOpen}
        campaign={applyingCampaign}
        isSubmitting={isSubmittingApplication}
        errorMessage={applyErrorMessage}
        onSubmit={handleApplyToCampaign}
      />
    </div>
  );
}
