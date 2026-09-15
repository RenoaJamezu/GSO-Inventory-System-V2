import { Navigate, Outlet } from "react-router-dom";

import { type Permission, usePermissions } from "@/features/auth";

type Props = {
  permission: Permission;
  redirectTo?: string;
};

export default function RequirePermission({
  permission,
  redirectTo = "/dashboard",
}: Props) {
  const { can, isLoading } = usePermissions();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!can(permission)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
