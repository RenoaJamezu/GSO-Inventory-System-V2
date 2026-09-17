import type { InventoryType } from "@/features/inventory/inventory-records";

import type { InventoryAccountFilters } from "./types";

export const inventoryAccountKeys = {
  root: ["inventory-accounts"] as const,

  lists: () => [...inventoryAccountKeys.root, "list"] as const,

  list: (inventoryType: InventoryType, filters?: InventoryAccountFilters) =>
    [
      ...inventoryAccountKeys.lists(),
      inventoryType,
      filters?.is_par_visible,
      filters?.is_high_cost_visible,
      filters?.is_low_cost_visible,
    ] as const,

  details: () => [...inventoryAccountKeys.root, "detail"] as const,

  detail: (id: number) => [...inventoryAccountKeys.details(), id] as const,
};
