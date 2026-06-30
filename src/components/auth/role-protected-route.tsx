import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import type { UserRole } from "@/types/auth";

type RoleProtectedRouteProps = {
  allowedRoles: UserRole[];
  children: ReactNode;
};

export function RoleProtectedRoute({
  allowedRoles,
  children,
}: RoleProtectedRouteProps) {
  const { user } = useAuth();

  // This is UI-level protection only. Backend APIs must still enforce real authorization.
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard/access-denied" replace />;
  }

  return <>{children}</>;
}
