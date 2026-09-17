import type { InventoryType } from "@/features/inventory/inventory-records";
import { supabase } from "@/lib/supabase";

import { INVENTORY_ACCOUNTS_TABLE } from "../constants";

import type {
  InventoryAccount,
  InventoryAccountFilters,
  InventoryAccountInput,
  ReorderInventoryAccountsInput,
} from "../types";

async function getAccounts(filters?: InventoryAccountFilters) {
  let query = supabase
    .from(INVENTORY_ACCOUNTS_TABLE)
    .select("*")
    .is("deleted_at", null)
    .order("sort_order", {
      ascending: true,
    })
    .order("id", {
      ascending: true,
    });

  if (filters?.is_par_visible !== undefined) {
    query = query.eq("is_par_visible", filters.is_par_visible);
  }

  if (filters?.is_high_cost_visible !== undefined) {
    query = query.eq("is_high_cost_visible", filters.is_high_cost_visible);
  }

  if (filters?.is_low_cost_visible !== undefined) {
    query = query.eq("is_low_cost_visible", filters.is_low_cost_visible);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data as InventoryAccount[];
}

async function attachPerInventoryReport(
  accounts: InventoryAccount[],
  inventoryType: InventoryType,
) {
  if (!accounts.length) {
    return [];
  }

  const accountIds = accounts.map((account) => account.id);

  const { data: amountColumns, error: columnError } = await supabase
    .from("account_columns")
    .select("account_id, field_key")
    .eq("is_amount_column", true)
    .is("deleted_at", null)
    .in("account_id", accountIds);

  if (columnError) {
    throw columnError;
  }

  const { data: records, error: recordError } = await supabase
    .from("inventory_records")
    .select("account_id,data")
    .eq("inventory_type", inventoryType)
    .is("deleted_at", null)
    .in("account_id", accountIds);

  if (recordError) {
    throw recordError;
  }

  return accounts.map((account) => {
    const amountField = amountColumns?.find(
      (column) => column.account_id === account.id,
    )?.field_key;

    let total = 0;

    if (amountField) {
      records
        ?.filter((record) => record.account_id === account.id)
        .forEach((record) => {
          const value = Number(record.data?.[amountField] ?? 0);

          if (Number.isFinite(value)) {
            total += value;
          }
        });
    }

    return {
      ...account,
      per_inventory_report: total,
    };
  });
}

export async function getInventoryAccounts(
  inventoryType: InventoryType,
  filters?: InventoryAccountFilters,
) {
  const accounts = await getAccounts(filters);

  return attachPerInventoryReport(accounts, inventoryType);
}

export async function getInventoryAccountById(id: number) {
  const { data, error } = await supabase
    .from(INVENTORY_ACCOUNTS_TABLE)
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    throw error;
  }

  return data as InventoryAccount;
}

export async function createInventoryAccount(account: InventoryAccountInput) {
  const { data: lastAccount, error: orderError } = await supabase
    .from(INVENTORY_ACCOUNTS_TABLE)
    .select("sort_order")
    .is("deleted_at", null)
    .order("sort_order", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (orderError) {
    throw orderError;
  }

  const nextSortOrder = (lastAccount?.sort_order ?? -1) + 1;

  const { data, error } = await supabase
    .from(INVENTORY_ACCOUNTS_TABLE)
    .insert({
      ...account,
      sort_order: nextSortOrder,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as InventoryAccount;
}

export async function updateInventoryAccount(
  id: number,
  account: InventoryAccountInput,
) {
  const { data, error } = await supabase
    .from(INVENTORY_ACCOUNTS_TABLE)
    .update(account)
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as InventoryAccount;
}

export async function deleteInventoryAccount(id: number) {
  const { error } = await supabase
    .from(INVENTORY_ACCOUNTS_TABLE)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    throw error;
  }
}

export async function reorderInventoryAccounts({
  accounts,
}: ReorderInventoryAccountsInput): Promise<void> {
  if (!accounts.length) {
    return;
  }

  const updates = accounts.map(({ id, sort_order }) =>
    supabase
      .from(INVENTORY_ACCOUNTS_TABLE)
      .update({
        sort_order,
      })
      .eq("id", id)
      .is("deleted_at", null),
  );

  const results = await Promise.all(updates);

  const failedResult = results.find((result) => result.error);

  if (failedResult?.error) {
    throw failedResult.error;
  }
}
