import { getInventoryAccounts } from "@/features/inventory/inventory-accounts/api/inventoryAccounts.api";
import type { InventoryType } from "@/features/inventory/inventory-records";
import { supabase } from "@/lib/supabase";

import type { DashboardInventorySummary, DashboardSummary } from "../types";

async function buildSummary(
  inventoryType: InventoryType,
): Promise<DashboardInventorySummary> {
  const accounts = await getInventoryAccounts(inventoryType);

  const total = accounts.reduce(
    (sum, account) => sum + account.per_inventory_report,
    0,
  );

  const accountIds = accounts.map((account) => account.id);

  let records = 0;

  if (accountIds.length > 0) {
    const { count, error } = await supabase
      .from("inventory_records")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("inventory_type", inventoryType)
      .in("account_id", accountIds)
      .is("deleted_at", null);

    if (error) {
      throw error;
    }

    records = count ?? 0;
  }

  return {
    total,
    records,
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
