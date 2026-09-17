import type { InventoryType } from "../../inventory-records";
import type { InventoryAccount } from "../types";

type VisibilityField =
  | "is_par_visible"
  | "is_high_cost_visible"
  | "is_low_cost_visible";

export interface InventoryWorkspace {
  title: string;
  description: string;
  inventoryType: InventoryType;
  route: string;
  visibilityField: VisibilityField;
}

const INVENTORY_WORKSPACES: Record<string, InventoryWorkspace> = {
  "/par": {
    title: "PAR Inventory",
    description: "Property Acknowledgement Receipt items issued to officers",
    inventoryType: "PAR",
    route: "par",
    visibilityField: "is_par_visible",
  },
  "/high-cost": {
    title: "ICS - High Cost",
    description: "High Cost Semi-Expendable Property Inventory",
    inventoryType: "HIGH_COST",
    route: "high-cost",
    visibilityField: "is_high_cost_visible",
  },
  "/low-cost": {
    title: "ICS - Low Cost",
    description: "Low Cost Semi-Expendable Property Inventory",
    inventoryType: "LOW_COST",
    route: "low-cost",
    visibilityField: "is_low_cost_visible",
  },
};

export function getInventoryWorkspace(
  pathname: string,
): InventoryWorkspace | null {
  const workspacePath = Object.keys(INVENTORY_WORKSPACES).find(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  return workspacePath ? INVENTORY_WORKSPACES[workspacePath] : null;
}

export function isAccountVisibleInWorkspace(
  account: InventoryAccount,
  workspace: InventoryWorkspace,
): boolean {
  return account[workspace.visibilityField];
}
