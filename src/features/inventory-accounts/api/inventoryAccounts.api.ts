import { supabase } from "@/lib/supabase";

import type { InventoryAccount, InventoryAccountInput } from "../types";
import {
  INVENTORY_ACCOUNTS_SUMMARY_VIEW,
  INVENTORY_ACCOUNTS_TABLE,
} from "../constants";

export async function getInventoryAccounts() {
  const { data, error } = await supabase
    .from(INVENTORY_ACCOUNTS_SUMMARY_VIEW)
    .select("*")
    .order("created_at", {
      ascending: true,
    });

  if (error) throw error;

  return data as InventoryAccount[];
}

export async function getInventoryAccountById(id: number) {
  const { data, error } = await supabase
    .from(INVENTORY_ACCOUNTS_TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as InventoryAccount;
}

export async function createInventoryAccount(account: InventoryAccountInput) {
  const { data, error } = await supabase
    .from(INVENTORY_ACCOUNTS_TABLE)
    .insert(account)
    .select("*")
    .single();

  if (error) throw error;

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
    .select("*")
    .single();

  if (error) throw error;

  return data as InventoryAccount;
}

export async function deleteInventoryAccount(id: number) {
  const deleted_at = new Date().toISOString();

  const { error } = await supabase
    .from(INVENTORY_ACCOUNTS_TABLE)
    .update({
      deleted_at,
    })
    .eq("id", id);

  if (error) throw error;
}
