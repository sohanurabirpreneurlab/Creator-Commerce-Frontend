import { useEffect, useState } from "react";
import { BriefcaseBusiness, Eye, Plus, RefreshCcw, Search } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  createAdminBrand,
  getAdminBrands,
  updateAdminBrand,
  updateAdminBrandStatus,
} from "@/lib/admin-api";
import type { Brand, BrandStatus } from "@/types/brand";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
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

const BRAND_STATUSES: BrandStatus[] = ["PENDING", "ACTIVE", "SUSPENDED", "REJECTED"];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

type BrandFormState = {
  name: string;
  industry: string;
  website: string;
  logoUrl: string;
  contactEmail: string;
};

function toFormState(brand?: Brand | null): BrandFormState {
  return {
    name: brand?.name ?? "",
    industry: brand?.industry ?? "",
    website: brand?.website ?? "",
    logoUrl: brand?.logoUrl ?? "",
    contactEmail: brand?.contactEmail ?? "",
  };
}

export function BrandsPage() {
  const { token, user } = useAuth();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BrandStatus | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formState, setFormState] = useState<BrandFormState>(toFormState());
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadBrands(searchValue: string, statusValue: BrandStatus | "ALL") {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await getAdminBrands(token, {
        page: 1,
        limit: 50,
        search: searchValue.trim() || undefined,
        status: statusValue === "ALL" ? undefined : statusValue,
      });
      setBrands(response.data);
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
      void loadBrands(search, statusFilter);
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [token, search, statusFilter]);

  const handleOpenCreate = () => {
    setEditingBrand(null);
    setFormState(toFormState());
    setIsFormOpen(true);
  };

  const handleOpenEdit = (brand: Brand) => {
    setEditingBrand(brand);
    setFormState(toFormState(brand));
    setIsFormOpen(true);
  };

  const handleSaveBrand = async () => {
    if (!token) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        name: formState.name,
        industry: formState.industry || undefined,
        website: formState.website || undefined,
        logoUrl: formState.logoUrl || undefined,
        contactEmail: formState.contactEmail || undefined,
      };

      const savedBrand = editingBrand
        ? await updateAdminBrand(token, editingBrand.id, payload)
        : await createAdminBrand(token, payload);

      setBrands((currentBrands) => {
        const alreadyExists = currentBrands.some((brand) => brand.id === savedBrand.id);
        return alreadyExists
          ? currentBrands.map((brand) => (brand.id === savedBrand.id ? savedBrand : brand))
          : [savedBrand, ...currentBrands];
      });

      setSuccessMessage(
        editingBrand ? "Brand updated successfully." : "Brand created successfully.",
      );
      setIsFormOpen(false);
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStatusChange = async (brand: Brand, nextStatus: BrandStatus) => {
    if (!token || brand.status === nextStatus) {
      return;
    }

    try {
      const updatedBrand = await updateAdminBrandStatus(token, brand.id, {
        status: nextStatus,
      });

      setBrands((currentBrands) =>
        currentBrands.map((item) => (item.id === updatedBrand.id ? updatedBrand : item)),
      );
      setSuccessMessage("Brand status updated successfully.");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  if (user?.role !== "SUPER_ADMIN") {
    return (
      <DataTableEmptyState
        title="Access denied"
        description="Brand management is available only for super admins."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
              <BriefcaseBusiness className="h-4 w-4" />
              Super Admin Brand Desk
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              Brands
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-muted">
              Create brands, keep profile information current, and move brands through the platform lifecycle.
            </p>
          </div>

          <div className="flex gap-3">
            <Button type="button" className="gap-2" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4" />
              Create Brand
            </Button>
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              onClick={() => void loadBrands(search, statusFilter)}
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
              placeholder="Search by brand name or industry..."
              className="pl-11"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as BrandStatus | "ALL")}
            className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm"
          >
            <option value="ALL">All statuses</option>
            {BRAND_STATUSES.map((status) => (
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
        <TableLoadingState message="Loading brands..." />
      ) : brands.length === 0 ? (
        <DataTableEmptyState
          title="No brands found"
          description="Try a different filter or create the first platform brand."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Industry</th>
                  <th className="px-6 py-4">Website</th>
                  <th className="px-6 py-4">Contact Email</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {brands.map((brand) => (
                  <tr key={brand.id} className="align-top">
                    <td className="px-6 py-4 font-semibold text-foreground">{brand.name}</td>
                    <td className="px-6 py-4">{brand.industry || "Not set"}</td>
                    <td className="px-6 py-4 break-all">{brand.website || "Not set"}</td>
                    <td className="px-6 py-4">{brand.contactEmail || "Not set"}</td>
                    <td className="px-6 py-4"><StatusBadge status={brand.status} /></td>
                    <td className="px-6 py-4">{formatDate(brand.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="justify-start gap-2"
                          onClick={() => {
                            setSelectedBrand(brand);
                            setIsDetailsOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleOpenEdit(brand)}
                        >
                          Edit
                        </Button>
                        <select
                          value={brand.status}
                          onChange={(event) =>
                            void handleStatusChange(brand, event.target.value as BrandStatus)
                          }
                          className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-foreground"
                        >
                          {BRAND_STATUSES.map((status) => (
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
            <DialogTitle>{selectedBrand?.name ?? "Brand details"}</DialogTitle>
            <DialogDescription>Review the full brand profile details in one place.</DialogDescription>
          </DialogHeader>
          {selectedBrand ? (
            <div className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
              <Card className="p-5"><p><span className="font-bold text-foreground">Industry:</span> {selectedBrand.industry || "Not set"}</p><p className="mt-3 break-all"><span className="font-bold text-foreground">Website:</span> {selectedBrand.website || "Not set"}</p></Card>
              <Card className="p-5"><p><span className="font-bold text-foreground">Contact email:</span> {selectedBrand.contactEmail || "Not set"}</p><p className="mt-3"><span className="font-bold text-foreground">Status:</span> <span className="ml-2 inline-block"><StatusBadge status={selectedBrand.status} /></span></p></Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="w-[95vw] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingBrand ? "Edit brand" : "Create brand"}</DialogTitle>
            <DialogDescription>
              These fields match the current brand backend contract directly so the admin flow stays easy to review.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="brand-name">Name</Label>
              <Input id="brand-name" value={formState.name} onChange={(event) => setFormState((currentState) => ({ ...currentState, name: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand-industry">Industry</Label>
              <Input id="brand-industry" value={formState.industry} onChange={(event) => setFormState((currentState) => ({ ...currentState, industry: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand-website">Website</Label>
              <Input id="brand-website" value={formState.website} onChange={(event) => setFormState((currentState) => ({ ...currentState, website: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand-logo">Logo URL</Label>
              <Input id="brand-logo" value={formState.logoUrl} onChange={(event) => setFormState((currentState) => ({ ...currentState, logoUrl: event.target.value }))} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="brand-email">Contact Email</Label>
              <Input id="brand-email" value={formState.contactEmail} onChange={(event) => setFormState((currentState) => ({ ...currentState, contactEmail: event.target.value }))} />
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
              <Button type="button" onClick={() => void handleSaveBrand()} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : editingBrand ? "Save Changes" : "Create Brand"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
