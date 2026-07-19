import { supabase } from "@/lib/supabase";

import type { DashboardSummary, DashboardInventorySummary } from "../types";
import type { InventoryType } from "@/features/inventory/inventory-records";
import { getInventoryAccounts } from "@/features/inventory/inventory-accounts/api/inventoryAccounts.api";

async function buildSummary(
  inventoryType: InventoryType,
): Promise<DashboardInventorySummary> {
  const accounts = await getInventoryAccounts(inventoryType);

  const total = accounts.reduce(
    (sum, account) => sum + account.per_inventory_report,
    0,
  );

  const { count, error } = await supabase
    .from("inventory_records")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("inventory_type", inventoryType)
    .is("deleted_at", null);

  if (error) throw error;

  return {
    total,
    records: count ?? 0,
  };
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [par, highCost, lowCost] = await Promise.all([
    buildSummary("PAR"),
    buildSummary("HIGH_COST"),
    buildSummary("LOW_COST"),
  ]);

  return {
    par,
    highCost,
    lowCost,
  };
}
