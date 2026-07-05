import { useCurrentUser } from "./useCurrentUser";
import { isAdmin, isStaff, isViewer } from "../permissions";

export function usePermissions() {
  const { data: user } = useCurrentUser();

  return {
    user,
    isAdmin: isAdmin(user),
    isStaff: isStaff(user),
    isViewer: isViewer(user),
    canCreate: isAdmin(user) || isStaff(user),
    canEdit: isAdmin(user) || isStaff(user),
    canDelete: isAdmin(user),
    canManageColumns: isAdmin(user),
    canManageGroups: isAdmin(user),
    canImportExcel: isAdmin(user) || isStaff(user),
    canPrint: true,
  };
}
