import { CalendarRange, CircleDollarSign, Globe, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AvailableCampaign } from "@/types/campaign";

function formatDateRange(startDate: string | null, endDate: string | null) {
  if (!startDate && !endDate) {
    return "Date range has not been set yet.";
  }

  const start = startDate ? new Date(startDate).toLocaleDateString() : "Open start";
  const end = endDate ? new Date(endDate).toLocaleDateString() : "Open end";
  return `${start} to ${end}`;
}

function formatBudget(budget: number) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(budget);
}

export function CampaignDetailsModal({
  open,
  onOpenChange,
  campaign,
  isLoading,
  onApply,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: AvailableCampaign | null;
  isLoading: boolean;
  onApply: (campaign: AvailableCampaign) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Campaign Details</DialogTitle>
          <DialogDescription>
            Review the campaign brief, brand information, and your current
            application state before taking action.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-6 text-sm text-slate-600">
            Loading campaign details...
          </div>
        ) : null}

        {!isLoading && !campaign ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 px-5 py-6 text-sm text-rose-700">
            Campaign details could not be loaded right now.
          </div>
        ) : null}

        {!isLoading && campaign ? (
          <div className="grid gap-5">
            <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Brand Information
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-semibold text-slate-500">Brand</p>
                  <p className="mt-1 text-base font-bold text-foreground">
                    {campaign.brand.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Industry</p>
                  <p className="mt-1 text-base text-foreground">
                    {campaign.brand.industry || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Website</p>
                  <p className="mt-1 text-base text-foreground">
                    {campaign.brand.website || "Not specified"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-500">Contact email</p>
                  <p className="mt-1 text-base text-foreground">
                    {campaign.brand.contactEmail || "Not specified"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Campaign Overview
              </p>
              <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-foreground">
                {campaign.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted">
                {campaign.description || "No campaign description has been added yet."}
              </p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Target className="h-4 w-4" />
                    Objective
                  </div>
                  <p className="mt-2 text-base font-bold text-foreground">
                    {campaign.objective.replaceAll("_", " ")}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <CircleDollarSign className="h-4 w-4" />
                    Budget
                  </div>
                  <p className="mt-2 text-base font-bold text-foreground">
                    {formatBudget(campaign.budget)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <CalendarRange className="h-4 w-4" />
                    Campaign Dates
                  </div>
                  <p className="mt-2 text-base font-bold text-foreground">
                    {formatDateRange(campaign.startDate, campaign.endDate)}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                    <Globe className="h-4 w-4" />
                    Destination URL
                  </div>
                  <p className="mt-2 break-all text-base font-bold text-foreground">
                    {campaign.destinationUrl || "Not specified"}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                Application Status
              </p>
              <p className="mt-3 text-base text-foreground">
                {campaign.hasApplied && campaign.application
                  ? `You already applied to this campaign. Current status: ${campaign.application.status}.`
                  : "You have not applied to this campaign yet."}
              </p>
            </section>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button
                type="button"
                disabled={campaign.hasApplied}
                onClick={() => onApply(campaign)}
              >
                {campaign.hasApplied ? "Applied" : "Apply to Campaign"}
              </Button>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
