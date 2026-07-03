import { supabase } from "@/lib/supabase";
import type { InventoryAccount, InventoryAccountInput } from "../types";

export async function getInventoryAccounts() {
  const { data, error } = await supabase
    .from("inventory_accounts_summary")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data as InventoryAccount[];
}

export async function getInventoryAccountById(id: number) {
  const { data, error } = await supabase
    .from("inventory_accounts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data;
}

export async function createInventoryAccount(account: InventoryAccountInput) {
  const { data, error } = await supabase
    .from("inventory_accounts")
    .insert(account)
    .select()
    .single();

  if (error) throw error;

  return data as InventoryAccount;
}

export async function updateInventoryAccount(
  id: number,
  account: InventoryAccountInput,
) {
  const { data, error } = await supabase
    .from("inventory_accounts")
    .update(account)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as InventoryAccount;
}

export async function deleteInventoryAccount(id: number) {
  const { error } = await supabase
    .from("inventory_accounts")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}
