import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/button";
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
import type {
  ApplyCampaignPayload,
  AvailableCampaign,
  ProposedContentType,
  SocialPlatform,
} from "@/types/campaign";

const proposedContentTypes: ProposedContentType[] = [
  "SHORT_VIDEO",
  "LONG_VIDEO",
  "STATIC_POST",
  "STORY",
  "REEL",
  "LIVE",
  "OTHER",
];

const socialPlatforms: SocialPlatform[] = [
  "FACEBOOK",
  "INSTAGRAM",
  "TIKTOK",
  "YOUTUBE",
  "LINKEDIN",
  "OTHER",
];

type FormState = {
  message: string;
  proposedContentType: string;
  primaryPlatform: string;
  expectedPostDate: string;
};

type FormErrors = Partial<Record<keyof FormState, string>>;

const initialFormState: FormState = {
  message: "",
  proposedContentType: "",
  primaryPlatform: "",
  expectedPostDate: "",
};

function formatCampaignDateRange(campaign: AvailableCampaign | null) {
  if (!campaign?.startDate && !campaign?.endDate) {
    return null;
  }

  const start = campaign.startDate
    ? new Date(campaign.startDate).toLocaleDateString()
    : "Open start";
  const end = campaign.endDate
    ? new Date(campaign.endDate).toLocaleDateString()
    : "Open end";

  return `Campaign runs from ${start} to ${end}.`;
}

function getTodayDateInputValue() {
  return new Date().toISOString().slice(0, 10);
}

export function ApplyCampaignModal({
  open,
  onOpenChange,
  campaign,
  isSubmitting,
  errorMessage,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  campaign: AvailableCampaign | null;
  isSubmitting: boolean;
  errorMessage: string | null;
  onSubmit: (payload: ApplyCampaignPayload) => Promise<void>;
}) {
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (!open) {
      return;
    }

    // Reset the form whenever the modal is reopened so the creator always starts
    // from a clean draft for the currently selected campaign.
    setFormState(initialFormState);
    setFormErrors({});
  }, [open, campaign?.id]);

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    const trimmedMessage = formState.message.trim();

    if (trimmedMessage.length === 0) {
      nextErrors.message = "Message is required.";
    } else if (trimmedMessage.length < 10) {
      nextErrors.message = "Message must be at least 10 characters.";
    } else if (trimmedMessage.length > 1000) {
      nextErrors.message = "Message must be 1000 characters or fewer.";
    }

    if (formState.expectedPostDate) {
      const selectedDate = new Date(formState.expectedPostDate);
      if (Number.isNaN(selectedDate.getTime())) {
        nextErrors.expectedPostDate = "Expected post date must be valid.";
      }
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: ApplyCampaignPayload = {
      message: formState.message.trim(),
    };

    if (formState.proposedContentType) {
      payload.proposedContentType =
        formState.proposedContentType as ProposedContentType;
    }

    if (formState.primaryPlatform) {
      payload.primaryPlatform = formState.primaryPlatform as SocialPlatform;
    }

    if (formState.expectedPostDate) {
      payload.expectedPostDate = new Date(formState.expectedPostDate).toISOString();
    }

    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply to Campaign</DialogTitle>
          <DialogDescription>
            Share a short pitch so the brand can understand how you want to
            promote this campaign.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
            <p className="text-sm font-semibold text-slate-700">
              {campaign?.title || "Selected campaign"}
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {campaign?.brand.name || "Brand information unavailable"}
            </p>
            {formatCampaignDateRange(campaign) ? (
              <p className="mt-2 text-xs font-medium text-slate-500">
                {formatCampaignDateRange(campaign)}
              </p>
            ) : null}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="application-message">Message / Pitch</Label>
            <Textarea
              id="application-message"
              rows={6}
              value={formState.message}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  message: event.target.value,
                }))
              }
              placeholder="Explain how you want to promote this campaign..."
            />
            <p className="text-xs text-slate-500">
              Keep your pitch between 10 and 1000 characters.
            </p>
            {formErrors.message ? (
              <p className="text-sm text-rose-600">{formErrors.message}</p>
            ) : null}
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="proposed-content-type">Proposed Content Type</Label>
              <select
                id="proposed-content-type"
                className="flex h-12 rounded-full border border-slate-200 bg-white px-4 text-sm text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                value={formState.proposedContentType}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    proposedContentType: event.target.value,
                  }))
                }
              >
                <option value="">Select a content type</option>
                {proposedContentTypes.map((contentType) => (
                  <option key={contentType} value={contentType}>
                    {contentType.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="primary-platform">Primary Platform</Label>
              <select
                id="primary-platform"
                className="flex h-12 rounded-full border border-slate-200 bg-white px-4 text-sm text-foreground outline-none transition focus:border-slate-400 focus:ring-2 focus:ring-slate-200"
                value={formState.primaryPlatform}
                onChange={(event) =>
                  setFormState((current) => ({
                    ...current,
                    primaryPlatform: event.target.value,
                  }))
                }
              >
                <option value="">Select a platform</option>
                {socialPlatforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="expected-post-date">Expected Post Date</Label>
            <Input
              id="expected-post-date"
              type="date"
              min={getTodayDateInputValue()}
              value={formState.expectedPostDate}
              onChange={(event) =>
                setFormState((current) => ({
                  ...current,
                  expectedPostDate: event.target.value,
                }))
              }
            />
            {formErrors.expectedPostDate ? (
              <p className="text-sm text-rose-600">
                {formErrors.expectedPostDate}
              </p>
            ) : null}
          </div>

          {errorMessage ? (
            <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
