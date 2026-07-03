import { supabase } from "@/lib/supabase";
import type { AccountColumn, AccountColumnInput } from "../types";

function normalizeFieldKey(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_");
}

export async function getAccountColumns(accountId: number) {
  const { data, error } = await supabase
    .from("account_columns")
    .select("*")
    .eq("account_id", accountId)
    .is("deleted_at", null)
    .order("display_order", {
      ascending: true,
    });

  if (error) throw error;

  return data as AccountColumn[];
}

export async function createAccountColumn(values: AccountColumnInput) {
  const field_key = normalizeFieldKey(values.label);

  // Prevent duplicate field keys
  const { data: existing } = await supabase
    .from("account_columns")
    .select("id")
    .eq("account_id", values.account_id)
    .eq("field_key", field_key)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) {
    throw new Error("A column with this label already exists.");
  }

  // Get next display order
  const { data: lastColumn } = await supabase
    .from("account_columns")
    .select("display_order")
    .eq("account_id", values.account_id)
    .is("deleted_at", null)
    .order("display_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const nextOrder = (lastColumn?.display_order ?? 0) + 1;

  // Only one amount column
  if (values.is_amount_column) {
    await supabase
      .from("account_columns")
      .update({
        is_amount_column: false,
      })
      .eq("account_id", values.account_id);
  }

  const { data, error } = await supabase
    .from("account_columns")
    .insert({
      ...values,
      field_key,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateAccountColumn(
  id: number,
  values: AccountColumnInput,
) {
  const field_key = normalizeFieldKey(values.label);

  const { data: existing } = await supabase
    .from("account_columns")
    .select("id")
    .eq("account_id", values.account_id)
    .eq("field_key", field_key)
    .neq("id", id)
    .is("deleted_at", null)
    .maybeSingle();

  if (existing) {
    throw new Error("A column with this label already exists.");
  }

  if (values.is_amount_column) {
    await supabase
      .from("account_columns")
      .update({
        is_amount_column: false,
      })
      .eq("account_id", values.account_id)
      .neq("id", id);
  }

  const { data, error } = await supabase
    .from("account_columns")
    .update({
      ...values,
      field_key,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteAccountColumn(id: number) {
  const { error } = await supabase
    .from("account_columns")
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}
