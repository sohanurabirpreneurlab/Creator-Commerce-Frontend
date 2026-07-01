import { useEffect, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import { RefreshCcw, UserRound } from "lucide-react";
import { ProfileCompletionCard } from "@/components/dashboard/profile-completion-card";
import { ProfileFormSection } from "@/components/dashboard/profile-form-section";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/use-auth";
import { getMyProfile, updateMyProfile } from "@/lib/profile-api";
import type {
  CreatorProfileResponse,
  ProfileResponse,
  UpdateProfilePayload,
} from "@/types/profile";

type CreatorFormState = {
  name: string;
  email: string;
  displayName: string;
  bio: string;
  category: string;
  location: string;
  profileImageUrl: string;
};

type BrandManagerFormState = {
  name: string;
  email: string;
  designation: string;
  brandName: string;
  brandIndustry: string;
  brandWebsite: string;
  brandContactEmail: string;
  brandLogoUrl: string;
};

type SuperAdminFormState = {
  name: string;
  email: string;
  role: string;
};

type ProfileFormState = CreatorFormState | BrandManagerFormState | SuperAdminFormState;

function createFormState(profile: ProfileResponse): ProfileFormState {
  if (profile.role === "CREATOR") {
    return {
      name: profile.user.name ?? "",
      email: profile.user.email ?? "",
      displayName: profile.creatorProfile?.displayName ?? "",
      bio: profile.creatorProfile?.bio ?? "",
      category: profile.creatorProfile?.category ?? "",
      location: profile.creatorProfile?.location ?? "",
      profileImageUrl: profile.creatorProfile?.profileImageUrl ?? "",
    };
  }

  if (profile.role === "BRAND_MANAGER") {
    return {
      name: profile.user.name ?? "",
      email: profile.user.email ?? "",
      designation: profile.brandManager.designation ?? "",
      brandName: profile.brand.name ?? "",
      brandIndustry: profile.brand.industry ?? "",
      brandWebsite: profile.brand.website ?? "",
      brandContactEmail: profile.brand.contactEmail ?? "",
      brandLogoUrl: profile.brand.logoUrl ?? "",
    };
  }

  return {
    name: profile.user.name ?? "",
    email: profile.user.email ?? "",
    role: profile.user.role ?? "",
  };
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

export function ProfilePage() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [formState, setFormState] = useState<ProfileFormState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      return;
    }

    const authToken = token;
    let isMounted = true;

    async function loadProfile() {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const result = await getMyProfile(authToken);

        if (!isMounted) {
          return;
        }

        setProfile(result);
        setFormState(createFormState(result));
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setErrorMessage(getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleRefresh = async () => {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await getMyProfile(token);
      setProfile(result);
      setFormState(createFormState(result));
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!token || !profile || !formState) {
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload = buildUpdatePayload(profile, formState);
      const updatedProfile = await updateMyProfile(token, payload);

      setProfile(updatedProfile);
      setFormState(createFormState(updatedProfile));
      setSuccessMessage("Profile updated successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8">
        <p className="text-lg font-bold text-foreground">Loading profile...</p>
        <p className="mt-2 text-sm text-muted">
          Your role-aware profile data is being prepared.
        </p>
      </Card>
    );
  }

  if (errorMessage && !profile) {
    return (
      <Card className="p-8">
        <p className="text-lg font-bold text-foreground">Unable to load profile</p>
        <p className="mt-2 text-sm text-rose-600">{errorMessage}</p>
        <Button type="button" className="mt-5 gap-2" onClick={() => void handleRefresh()}>
          <RefreshCcw className="h-4 w-4" />
          Try again
        </Button>
      </Card>
    );
  }

  if (!profile || !formState) {
    return null;
  }

  return (
    <form className="grid gap-6" onSubmit={handleSubmit}>
      <Card className="p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
              <UserRound className="h-4 w-4" />
              Dashboard Profile
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              Manage Your Profile
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              This page shows only the fields that belong to your account role.
              Completion rules come from the backend so the progress bar stays
              consistent across clients.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => void handleRefresh()}
            >
              <RefreshCcw className="h-4 w-4" />
              Refresh
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
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

      <ProfileCompletionCard completion={profile.completion} />

      <ProfileFormSection
        title="Basic Information"
        description="These are your core account details. Email and role stay read-only on this page."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="name"
            label="Name"
            value={formState.name}
            onChange={(value) => setFormState((current) => current ? { ...current, name: value } : current)}
          />
          <Field id="email" label="Email" value={formState.email} disabled />
        </div>
      </ProfileFormSection>

      {profile.role === "CREATOR" ? (
        <CreatorSections
          profile={profile}
          formState={formState as CreatorFormState}
          onChange={setFormState}
        />
      ) : null}

      {profile.role === "BRAND_MANAGER" ? (
        <BrandManagerSections
          formState={formState as BrandManagerFormState}
          onChange={setFormState}
        />
      ) : null}

      {profile.role === "SUPER_ADMIN" ? (
        <SuperAdminSection formState={formState as SuperAdminFormState} />
      ) : null}
    </form>
  );
}

function CreatorSections({
  profile,
  formState,
  onChange,
}: {
  profile: CreatorProfileResponse;
  formState: CreatorFormState;
  onChange: Dispatch<SetStateAction<ProfileFormState | null>>;
}) {
  return (
    <>
      <ProfileFormSection
        title="Creator Information"
        description="These fields shape how your creator identity appears in future brand-facing workflows."
      >
        {!profile.creatorProfile ? (
          <p className="mb-5 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
            You do not have a creator profile yet. Add at least a display name
            and save to create it through the generic profile flow.
          </p>
        ) : null}

        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="display-name"
            label="Display Name"
            value={formState.displayName}
            onChange={(value) =>
              onChange((current) =>
                current ? { ...current, displayName: value } : current,
              )
            }
          />
          <Field
            id="category"
            label="Category"
            value={formState.category}
            onChange={(value) =>
              onChange((current) =>
                current ? { ...current, category: value } : current,
              )
            }
          />
          <Field
            id="location"
            label="Location"
            value={formState.location}
            onChange={(value) =>
              onChange((current) =>
                current ? { ...current, location: value } : current,
              )
            }
          />
          <Field
            id="profile-image-url"
            label="Profile Image URL"
            value={formState.profileImageUrl}
            onChange={(value) =>
              onChange((current) =>
                current ? { ...current, profileImageUrl: value } : current,
              )
            }
          />
        </div>

        <div className="mt-5">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formState.bio}
            onChange={(event) =>
              onChange((current) =>
                current ? { ...current, bio: event.target.value } : current,
              )
            }
            placeholder="Tell brands what kind of content you create."
            className="mt-2"
          />
        </div>
      </ProfileFormSection>

      <ProfileFormSection
        title="Social Accounts"
        description="Social account management stays separate from this profile update flow."
      >
        {profile.socialAccounts.length > 0 ? (
          <div className="grid gap-3">
            {profile.socialAccounts.map((account) => (
              <div
                key={account.id}
                className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4"
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-slate-600">
                    {account.platform}
                  </span>
                  {account.verified ? (
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                      Verified
                    </span>
                  ) : null}
                </div>
                <p className="mt-3 break-all text-sm text-foreground">
                  {account.profileUrl}
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.14em] text-slate-500">
                  Followers: {account.followersCount} | Engagement:{" "}
                  {account.engagementRate ?? "N/A"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-muted">
            Social account management will be added separately.
          </p>
        )}
      </ProfileFormSection>
    </>
  );
}

function BrandManagerSections({
  formState,
  onChange,
}: {
  formState: BrandManagerFormState;
  onChange: Dispatch<SetStateAction<ProfileFormState | null>>;
}) {
  return (
    <>
      <ProfileFormSection
        title="Brand Manager Information"
        description="These fields identify your operational role for the assigned brand."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="designation"
            label="Designation"
            value={formState.designation}
            onChange={(value) =>
              onChange((current) =>
                current ? { ...current, designation: value } : current,
              )
            }
          />
        </div>
      </ProfileFormSection>

      <ProfileFormSection
        title="Brand Information"
        description="Brand details are shared with your organization."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <Field
            id="brand-name"
            label="Brand Name"
            value={formState.brandName}
            onChange={(value) =>
              onChange((current) =>
                current ? { ...current, brandName: value } : current,
              )
            }
          />
          <Field
            id="brand-industry"
            label="Industry"
            value={formState.brandIndustry}
            onChange={(value) =>
              onChange((current) =>
                current ? { ...current, brandIndustry: value } : current,
              )
            }
          />
          <Field
            id="brand-website"
            label="Website"
            value={formState.brandWebsite}
            onChange={(value) =>
              onChange((current) =>
                current ? { ...current, brandWebsite: value } : current,
              )
            }
          />
          <Field
            id="brand-contact-email"
            label="Contact Email"
            value={formState.brandContactEmail}
            onChange={(value) =>
              onChange((current) =>
                current ? { ...current, brandContactEmail: value } : current,
              )
            }
          />
          <div className="md:col-span-2">
            <Field
              id="brand-logo-url"
              label="Logo URL"
              value={formState.brandLogoUrl}
              onChange={(value) =>
                onChange((current) =>
                  current ? { ...current, brandLogoUrl: value } : current,
                )
              }
            />
          </div>
        </div>
      </ProfileFormSection>
    </>
  );
}

function SuperAdminSection({
  formState,
}: {
  formState: SuperAdminFormState;
}) {
  return (
    <ProfileFormSection
      title="Admin Information"
      description="Role changes remain restricted to dedicated admin user management APIs."
    >
      <div className="grid gap-5 md:grid-cols-2">
        <Field id="role" label="Role" value={formState.role} disabled />
      </div>
    </ProfileFormSection>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  disabled = false,
}: {
  id: string;
  label: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
        disabled={disabled}
        className="mt-2"
      />
    </div>
  );
}

function buildUpdatePayload(
  profile: ProfileResponse,
  formState: ProfileFormState,
): UpdateProfilePayload {
  if (profile.role === "CREATOR") {
    const creatorState = formState as CreatorFormState;

    return {
      user: {
        name: creatorState.name,
      },
      creatorProfile: {
        displayName: creatorState.displayName,
        bio: creatorState.bio,
        category: creatorState.category,
        location: creatorState.location,
        profileImageUrl: creatorState.profileImageUrl,
      },
    };
  }

  if (profile.role === "BRAND_MANAGER") {
    const brandManagerState = formState as BrandManagerFormState;

    return {
      user: {
        name: brandManagerState.name,
      },
      brandManager: {
        designation: brandManagerState.designation,
      },
      brand: {
        name: brandManagerState.brandName,
        industry: brandManagerState.brandIndustry,
        website: brandManagerState.brandWebsite,
        contactEmail: brandManagerState.brandContactEmail,
        logoUrl: brandManagerState.brandLogoUrl,
      },
    };
  }

  const superAdminState = formState as SuperAdminFormState;

  return {
    user: {
      name: superAdminState.name,
    },
  };
}
