import type { InventoryType } from "../types";

export type InventoryWorkspaceSlug = "par" | "high-cost" | "low-cost";

export type InventoryRouteContext = {
  inventoryType: InventoryType;
  workspace: InventoryWorkspaceSlug;
  title: string;
  backLink: string;
};

const INVENTORY_ROUTE_CONTEXTS: Record<
  InventoryWorkspaceSlug,
  InventoryRouteContext
> = {
  par: {
    inventoryType: "PAR",
    workspace: "par",
    title: "PAR Inventory",
    backLink: "/par",
  },
  "high-cost": {
    inventoryType: "HIGH_COST",
    workspace: "high-cost",
    title: "ICS - High Cost",
    backLink: "/high-cost",
  },
  "low-cost": {
    inventoryType: "LOW_COST",
    workspace: "low-cost",
    title: "ICS - Low Cost",
    backLink: "/low-cost",
  },
};

export function getInventoryRouteContext(
  pathname: string,
): InventoryRouteContext | null {
  const workspace = Object.keys(INVENTORY_ROUTE_CONTEXTS).find(
    (key) => pathname === `/${key}` || pathname.startsWith(`/${key}/`),
  ) as InventoryWorkspaceSlug | undefined;

  return workspace ? INVENTORY_ROUTE_CONTEXTS[workspace] : null;
}
