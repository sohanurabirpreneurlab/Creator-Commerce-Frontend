import { useEffect, useState } from "react";
import { RefreshCcw, Search, ShieldCheck } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  getAdminRolesBreakdown,
  getAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "@/lib/admin-api";
import type { AdminUserStatus, AdminUserSummary } from "@/types/admin-user";
import type { UserRole } from "@/types/auth";
import { DataTableEmptyState } from "@/components/dashboard/data-table-empty-state";
import { RoleBadge } from "@/components/dashboard/role-badge";
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

const ROLE_OPTIONS: UserRole[] = ["CREATOR", "BRAND_MANAGER", "SUPER_ADMIN"];
const STATUS_OPTIONS: AdminUserStatus[] = ["ACTIVE", "SUSPENDED", "DISABLED"];

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Something went wrong.";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

export function UsersPage() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [roleBreakdown, setRoleBreakdown] = useState<Array<{ role: UserRole; count: number }>>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<UserRole | "ALL">("ALL");
  const [statusFilter, setStatusFilter] = useState<AdminUserStatus | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<AdminUserSummary | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [draftRole, setDraftRole] = useState<UserRole>("CREATOR");
  const [draftStatus, setDraftStatus] = useState<AdminUserStatus>("ACTIVE");

  async function loadUsers() {
    if (!token) {
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const [usersResponse, breakdownResponse] = await Promise.all([
        getAdminUsers(token, {
          page: 1,
          limit: 100,
          search: search.trim() || undefined,
          role: roleFilter === "ALL" ? undefined : roleFilter,
          status: statusFilter === "ALL" ? undefined : statusFilter,
        }),
        getAdminRolesBreakdown(token),
      ]);

      setUsers(usersResponse.data);
      setRoleBreakdown(breakdownResponse);
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
      void loadUsers();
    }, 250);

    return () => window.clearTimeout(timeoutId);
  }, [token, search, roleFilter, statusFilter]);

  const handleOpenRoleDialog = (managedUser: AdminUserSummary) => {
    setSelectedUser(managedUser);
    setDraftRole(managedUser.role);
    setIsRoleDialogOpen(true);
  };

  const handleOpenStatusDialog = (managedUser: AdminUserSummary) => {
    setSelectedUser(managedUser);
    setDraftStatus(managedUser.status);
    setIsStatusDialogOpen(true);
  };

  const handleSaveRole = async () => {
    if (!token || !selectedUser) {
      return;
    }

    try {
      const updatedUser = await updateAdminUserRole(token, selectedUser.id, {
        role: draftRole,
      });

      setUsers((currentUsers) =>
        currentUsers.map((managedUser) =>
          managedUser.id === selectedUser.id ? { ...managedUser, role: updatedUser.role } : managedUser,
        ),
      );
      setSuccessMessage("User role updated successfully.");
      setIsRoleDialogOpen(false);
      await loadUsers();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  const handleSaveStatus = async () => {
    if (!token || !selectedUser) {
      return;
    }

    try {
      const updatedUser = await updateAdminUserStatus(token, selectedUser.id, {
        status: draftStatus,
      });

      setUsers((currentUsers) =>
        currentUsers.map((managedUser) =>
          managedUser.id === selectedUser.id ? { ...managedUser, status: updatedUser.status } : managedUser,
        ),
      );
      setSuccessMessage("User status updated successfully.");
      setIsStatusDialogOpen(false);
      await loadUsers();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    }
  };

  if (user?.role !== "SUPER_ADMIN") {
    return (
      <DataTableEmptyState
        title="Access denied"
        description="Users and roles are available only for super admins."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
              <ShieldCheck className="h-4 w-4" />
              Super Admin Access Control
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-foreground">
              Users & Roles
            </h1>
            <p className="mt-3 text-sm leading-7 text-muted">
              Review platform users, update roles and user status, and keep role distribution visible in the same workspace.
            </p>
          </div>

          <Button type="button" variant="outline" className="gap-2" onClick={() => void loadUsers()}>
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name or email..."
              className="pl-11"
            />
          </div>
          <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as UserRole | "ALL")} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm">
            <option value="ALL">All roles</option>
            {ROLE_OPTIONS.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption.replaceAll("_", " ")}
              </option>
            ))}
          </select>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as AdminUserStatus | "ALL")} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm">
            <option value="ALL">All statuses</option>
            {STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption.replaceAll("_", " ")}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {roleBreakdown.map((item) => (
            <Card key={item.role} className="p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                {item.role.replaceAll("_", " ")}
              </p>
              <p className="mt-2 text-3xl font-extrabold text-foreground">{item.count}</p>
            </Card>
          ))}
        </div>

        <p className="mt-4 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Changing role does not automatically create brand manager assignment or creator profile records.
        </p>

        {successMessage ? <p className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{successMessage}</p> : null}
        {errorMessage ? <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</p> : null}
      </Card>

      {isLoading ? (
        <TableLoadingState message="Loading users..." />
      ) : users.length === 0 ? (
        <DataTableEmptyState
          title="No users found"
          description="Try another search, role, or status filter."
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created</th>
                  <th className="px-6 py-4">Related Profile</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-sm text-slate-700">
                {users.map((managedUser) => (
                  <tr key={managedUser.id}>
                    <td className="px-6 py-4 font-semibold text-foreground">{managedUser.name}</td>
                    <td className="px-6 py-4">{managedUser.email}</td>
                    <td className="px-6 py-4"><RoleBadge role={managedUser.role} /></td>
                    <td className="px-6 py-4"><StatusBadge status={managedUser.status} /></td>
                    <td className="px-6 py-4">{formatDate(managedUser.createdAt)}</td>
                    <td className="px-6 py-4 text-xs text-muted">
                      {managedUser.relatedProfileSummary.creatorProfileId
                        ? `Creator: ${managedUser.relatedProfileSummary.creatorProfileId}`
                        : managedUser.relatedProfileSummary.brandManagerId
                          ? `Manager: ${managedUser.relatedProfileSummary.brandManagerId}`
                          : "No related profile"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2">
                        <Button type="button" variant="outline" onClick={() => { setSelectedUser(managedUser); setIsDetailsOpen(true); }}>
                          View Details
                        </Button>
                        <Button type="button" variant="outline" onClick={() => handleOpenRoleDialog(managedUser)}>
                          Change Role
                        </Button>
                        <Button type="button" variant="outline" onClick={() => handleOpenStatusDialog(managedUser)}>
                          Update Status
                        </Button>
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
            <DialogTitle>{selectedUser?.name ?? "User details"}</DialogTitle>
            <DialogDescription>Inspect the current role, status, and related profile mapping for this account.</DialogDescription>
          </DialogHeader>
          {selectedUser ? (
            <div className="grid gap-4 text-sm text-slate-700 md:grid-cols-2">
              <Card className="p-5">
                <p><span className="font-bold text-foreground">Email:</span> {selectedUser.email}</p>
                <p className="mt-3"><span className="font-bold text-foreground">Role:</span> <span className="ml-2"><RoleBadge role={selectedUser.role} /></span></p>
                <p className="mt-3"><span className="font-bold text-foreground">Status:</span> <span className="ml-2"><StatusBadge status={selectedUser.status} /></span></p>
              </Card>
              <Card className="p-5">
                <p><span className="font-bold text-foreground">Created:</span> {formatDate(selectedUser.createdAt)}</p>
                <p className="mt-3 break-all"><span className="font-bold text-foreground">Creator Profile:</span> {selectedUser.relatedProfileSummary.creatorProfileId || "None"}</p>
                <p className="mt-3 break-all"><span className="font-bold text-foreground">Brand Manager Assignment:</span> {selectedUser.relatedProfileSummary.brandManagerId || "None"}</p>
              </Card>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
        <DialogContent className="w-[95vw] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Change user role</DialogTitle>
            <DialogDescription>Be explicit here because role changes affect dashboard access immediately after the next session refresh.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="user-role-select">Role</Label>
              <select id="user-role-select" value={draftRole} onChange={(event) => setDraftRole(event.target.value as UserRole)} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm">
                {ROLE_OPTIONS.map((roleOption) => (
                  <option key={roleOption} value={roleOption}>
                    {roleOption.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            {selectedUser?.id === user?.id && draftRole !== "SUPER_ADMIN" ? (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
                You cannot demote your own super admin account.
              </p>
            ) : null}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsRoleDialogOpen(false)}>Cancel</Button>
              <Button type="button" onClick={() => void handleSaveRole()} disabled={selectedUser?.id === user?.id && draftRole !== "SUPER_ADMIN"}>
                Save Role
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="w-[95vw] max-w-xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Update user status</DialogTitle>
            <DialogDescription>Suspension and disable flows remain explicit here so account state changes are not accidental.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="user-status-select">Status</Label>
              <select id="user-status-select" value={draftStatus} onChange={(event) => setDraftStatus(event.target.value as AdminUserStatus)} className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-foreground shadow-sm">
                {STATUS_OPTIONS.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => setIsStatusDialogOpen(false)}>Cancel</Button>
              <Button type="button" onClick={() => void handleSaveStatus()}>Save Status</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
