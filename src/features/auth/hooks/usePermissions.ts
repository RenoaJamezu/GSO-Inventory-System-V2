import {
  hasPermission,
  isAdmin,
  isStaff,
  type Permission,
} from "../permissions";

import { useCurrentUser } from "./useCurrentUser";

export function usePermissions() {
  const { data: user, isLoading } = useCurrentUser();

  function can(permission: Permission) {
    return hasPermission(user, permission);
  }

  return {
    user,
    isLoading,

    isAdmin: isAdmin(user),
    isStaff: isStaff(user),

    can,
  };
}
