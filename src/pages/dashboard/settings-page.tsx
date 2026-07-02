import { useEffect, useState } from "react";
import { Bell, LoaderCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import {
  getNotificationPreferences,
  updateNotificationPreferences,
} from "@/lib/notification-api";
import type {
  NotificationPreferences,
  UpdateNotificationPreferencesPayload,
} from "@/types/notification";

type PreferenceKey = keyof UpdateNotificationPreferencesPayload;

const preferenceFields: Array<{
  key: PreferenceKey;
  label: string;
  description: string;
}> = [
  {
    key: "inAppEnabled",
    label: "In-app notifications",
    description: "Show notifications in the dashboard and realtime bell.",
  },
  {
    key: "campaignUpdatesEnabled",
    label: "Campaign updates",
    description: "Campaign creation, approval, rejection, and status changes.",
  },
  {
    key: "applicationUpdatesEnabled",
    label: "Application updates",
    description: "Creator applications, approvals, rejections, and withdrawals.",
  },
  {
    key: "contentUpdatesEnabled",
    label: "Content updates",
    description: "Content approvals, rejections, and requested changes.",
  },
  {
    key: "trackingLinkUpdatesEnabled",
    label: "Tracking link updates",
    description: "Tracking link generation and deactivation updates.",
  },
  {
    key: "profileUpdatesEnabled",
    label: "Profile updates",
    description: "Profile verification, role, and account status updates.",
  },
  {
    key: "systemUpdatesEnabled",
    label: "System updates",
    description: "Important platform announcements and alerts.",
  },
];

export function SettingsPage() {
  const { token } = useAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    getNotificationPreferences(token)
      .then(setPreferences)
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleToggle = (key: PreferenceKey) => {
    setPreferences((currentPreferences) => {
      if (!currentPreferences) {
        return currentPreferences;
      }

      return {
        ...currentPreferences,
        [key]: !currentPreferences[key],
      };
    });
    setSuccessMessage(null);
  };

  const handleSave = async () => {
    if (!token || !preferences) {
      return;
    }

    setIsSaving(true);

    try {
      const payload = preferenceFields.reduce<UpdateNotificationPreferencesPayload>(
        (currentPayload, field) => ({
          ...currentPayload,
          [field.key]: preferences[field.key],
        }),
        {},
      );

      const updatedPreferences = await updateNotificationPreferences(token, payload);
      setPreferences(updatedPreferences);
      setSuccessMessage("Notification preferences saved.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-50 text-sky-600">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Settings
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Manage notification preferences for dashboard updates.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-7">
        <div className="flex flex-col gap-4 border-b border-slate-100 pb-5 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Notification Preferences
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              These settings control stored in-app notifications and realtime bell updates.
            </p>
          </div>
          <Button type="button" onClick={() => void handleSave()} disabled={!preferences || isSaving}>
            {isSaving ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save
          </Button>
        </div>

        {isLoading ? (
          <p className="py-6 text-sm text-muted">Loading preferences...</p>
        ) : preferences ? (
          <div className="divide-y divide-slate-100">
            {preferenceFields.map((field) => (
              <label
                key={field.key}
                className="flex cursor-pointer flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <span>
                  <span className="block text-sm font-bold text-foreground">
                    {field.label}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted">
                    {field.description}
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={Boolean(preferences[field.key])}
                  onChange={() => handleToggle(field.key)}
                  className="h-5 w-5 rounded border-slate-300 text-primary focus:ring-primary"
                />
              </label>
            ))}
          </div>
        ) : (
          <p className="py-6 text-sm text-muted">Unable to load preferences.</p>
        )}

        {successMessage ? (
          <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {successMessage}
          </p>
        ) : null}
      </Card>
    </div>
  );
}
