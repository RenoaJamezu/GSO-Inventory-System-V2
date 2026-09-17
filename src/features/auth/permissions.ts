import type { CurrentUser, UserRole } from "./types";

export const PERMISSIONS = {
  // Dashboard
  DASHBOARD_VIEW: "dashboard.view",

  // Inventory workspaces
  INVENTORY_VIEW: "inventory.view",
  INVENTORY_CREATE: "inventory.create",
  INVENTORY_UPDATE: "inventory.update",
  INVENTORY_DELETE: "inventory.delete",

  INVENTORY_MANAGE_ACCOUNTS: "inventory.manage_accounts",
  INVENTORY_MANAGE_COLUMNS: "inventory.manage_columns",
  INVENTORY_MANAGE_GROUPS: "inventory.manage_groups",

  INVENTORY_IMPORT: "inventory.import",
  INVENTORY_EXPORT: "inventory.export",
  INVENTORY_PRINT: "inventory.print",

  // Stock Card
  STOCK_CARD_VIEW: "stock_card.view",
  STOCK_CARD_CREATE: "stock_card.create",
  STOCK_CARD_UPDATE: "stock_card.update",
  STOCK_CARD_DELETE: "stock_card.delete",

  // Vehicle Records
  VEHICLE_VIEW: "vehicle.view",
  VEHICLE_CREATE: "vehicle.create",
  VEHICLE_UPDATE: "vehicle.update",
  VEHICLE_DELETE: "vehicle.delete",

  // Activity Logs
  ACTIVITY_VIEW: "activity.view",

  // Administrative features
  USERS_MANAGE: "users.manage",

  SETTINGS_MANAGE: "settings.manage",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ADMIN_PERMISSIONS: Permission[] = [
  PERMISSIONS.DASHBOARD_VIEW,

  PERMISSIONS.INVENTORY_VIEW,
  PERMISSIONS.INVENTORY_CREATE,
  PERMISSIONS.INVENTORY_UPDATE,
  PERMISSIONS.INVENTORY_DELETE,
  PERMISSIONS.INVENTORY_MANAGE_ACCOUNTS,
  PERMISSIONS.INVENTORY_MANAGE_COLUMNS,
  PERMISSIONS.INVENTORY_MANAGE_GROUPS,
  PERMISSIONS.INVENTORY_IMPORT,
  PERMISSIONS.INVENTORY_EXPORT,
  PERMISSIONS.INVENTORY_PRINT,

  PERMISSIONS.STOCK_CARD_VIEW,
  PERMISSIONS.STOCK_CARD_CREATE,
  PERMISSIONS.STOCK_CARD_UPDATE,
  PERMISSIONS.STOCK_CARD_DELETE,

  PERMISSIONS.VEHICLE_VIEW,
  PERMISSIONS.VEHICLE_CREATE,
  PERMISSIONS.VEHICLE_UPDATE,
  PERMISSIONS.VEHICLE_DELETE,

  PERMISSIONS.ACTIVITY_VIEW,

  PERMISSIONS.USERS_MANAGE,
  PERMISSIONS.SETTINGS_MANAGE,
];

const STAFF_PERMISSIONS: Permission[] = [
  PERMISSIONS.DASHBOARD_VIEW,

  PERMISSIONS.INVENTORY_VIEW,
  PERMISSIONS.INVENTORY_CREATE,
  PERMISSIONS.INVENTORY_UPDATE,

  PERMISSIONS.INVENTORY_MANAGE_GROUPS,

  PERMISSIONS.INVENTORY_IMPORT,
  PERMISSIONS.INVENTORY_EXPORT,
  PERMISSIONS.INVENTORY_PRINT,

  PERMISSIONS.STOCK_CARD_VIEW,
  PERMISSIONS.STOCK_CARD_CREATE,
  PERMISSIONS.STOCK_CARD_UPDATE,

  PERMISSIONS.VEHICLE_VIEW,
  PERMISSIONS.VEHICLE_CREATE,
  PERMISSIONS.VEHICLE_UPDATE,

  PERMISSIONS.ACTIVITY_VIEW,
];

export const ROLE_PERMISSIONS: Record<UserRole, readonly Permission[]> = {
  ADMIN: ADMIN_PERMISSIONS,
  STAFF: STAFF_PERMISSIONS,
};

export function isAdmin(user?: CurrentUser | null) {
  return user?.role === "ADMIN";
}

export function isStaff(user?: CurrentUser | null) {
  return user?.role === "STAFF";
}

export function hasPermission(
  user: CurrentUser | null | undefined,
  permission: Permission,
) {
  if (!user) {
    return false;
  }

  return ROLE_PERMISSIONS[user.role].includes(permission);
}
