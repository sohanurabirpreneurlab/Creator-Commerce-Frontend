import { useMemo, useState } from "react";
import { Search, Trash2, Users2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RoleBadge } from "@/components/dashboard/role-badge";
import type { UserRole } from "@/types/auth";

type ManagedUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: "ACTIVE" | "SUSPENDED";
};

const roleOptions: UserRole[] = ["CREATOR", "BRAND_MANAGER", "SUPER_ADMIN"];

const initialUsers: ManagedUser[] = [
  {
    id: "usr_001",
    name: "Nadia Rahman",
    email: "nadia.creator@example.com",
    role: "CREATOR",
    status: "ACTIVE",
  },
  {
    id: "usr_002",
    name: "Karim Hasan",
    email: "karim.brand@example.com",
    role: "BRAND_MANAGER",
    status: "ACTIVE",
  },
  {
    id: "usr_003",
    name: "Samira Islam",
    email: "samira.admin@example.com",
    role: "SUPER_ADMIN",
    status: "ACTIVE",
  },
  {
    id: "usr_004",
    name: "Tariq Mahmud",
    email: "tariq.creator@example.com",
    role: "CREATOR",
    status: "SUSPENDED",
  },
];

export function UsersPage() {
  const [users, setUsers] = useState<ManagedUser[]>(initialUsers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<"ALL" | UserRole>("ALL");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return users.filter((user) => {
      // Search stays intentionally simple here: name and email are the
      // most common admin lookup fields before richer backend search exists.
      const matchesSearch =
        normalizedQuery.length === 0 ||
        user.name.toLowerCase().includes(normalizedQuery) ||
        user.email.toLowerCase().includes(normalizedQuery);

      const matchesRole =
        selectedRole === "ALL" ? true : user.role === selectedRole;

      return matchesSearch && matchesRole;
    });
  }, [searchQuery, selectedRole, users]);

  const handleRoleChange = (userId: string, nextRole: UserRole) => {
    // This is frontend-only state for now. Once backend APIs exist,
    // this handler should call the admin role update endpoint first.
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, role: nextRole } : user,
      ),
    );
  };

  const handleDeleteUser = (userId: string) => {
    // Keep the delete interaction explicit because user removal is a destructive action.
    // Later this should become a confirmed backend delete/deactivate workflow.
    setUsers((currentUsers) => currentUsers.filter((user) => user.id !== userId));
  };

  return (
    <div className="grid gap-6">
      <Card className="p-7">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-slate-700">
              <Users2 className="h-4 w-4" />
              Admin Workspace
            </div>
            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground">
              Users & Roles
            </h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Review platform users, filter by name or role, update access level,
              and remove profiles from this dashboard view. These controls are
              currently frontend placeholders and do not persist to the backend yet.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-3xl border border-border bg-slate-50 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Total Users
              </p>
              <p className="mt-2 text-3xl font-extrabold text-foreground">
                {users.length}
              </p>
            </div>
            <div className="rounded-3xl border border-border bg-slate-50 px-5 py-4">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">
                Visible Results
              </p>
              <p className="mt-2 text-3xl font-extrabold text-foreground">
                {filteredUsers.length}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-7">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div>
            <Label htmlFor="user-search">Search Users</Label>
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="user-search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name or email"
                className="h-11 pl-11"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="role-filter">Filter By Role</Label>
            <select
              id="role-filter"
              value={selectedRole}
              onChange={(event) =>
                setSelectedRole(event.target.value as "ALL" | UserRole)
              }
              className="mt-2 flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <option value="ALL">All Roles</option>
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-bold text-foreground">{user.name}</h3>
                  <RoleBadge role={user.role} />
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-slate-600">
                    {user.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted">{user.email}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">
                  User ID: {user.id}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-[220px_auto] sm:items-end">
                <div>
                  <Label htmlFor={`role-${user.id}`}>Change Role</Label>
                  <select
                    id={`role-${user.id}`}
                    value={user.role}
                    onChange={(event) =>
                      handleRoleChange(user.id, event.target.value as UserRole)
                    }
                    className="mt-2 flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  >
                    {roleOptions.map((role) => (
                      <option key={role} value={role}>
                        {role.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="gap-2 border-rose-200 text-rose-500 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-600"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Profile
                </Button>
              </div>
            </div>
          </Card>
        ))}

        {filteredUsers.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-lg font-bold text-foreground">No users found</p>
            <p className="mt-2 text-sm text-muted">
              Try a different search term or switch the selected role filter.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
