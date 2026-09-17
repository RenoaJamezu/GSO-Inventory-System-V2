import { supabase } from "@/lib/supabase";
import { normalizeFieldKey } from "@/lib/utils/normalizeFieldKey";

import { ACCOUNT_COLUMNS_TABLE } from "../constants";
import type {
  AccountColumn,
  AccountColumnInput,
  DeleteAccountColumnInput,
  ReorderAccountColumnsInput,
} from "../types";

export async function getAccountColumns(accountId: number) {
  const { data, error } = await supabase
    .from(ACCOUNT_COLUMNS_TABLE)
    .select("*")
    .eq("account_id", accountId)
    .is("deleted_at", null)
    .order("display_order", {
      ascending: true,
    })
    .order("id", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data as AccountColumn[];
}

export async function createAccountColumn(values: AccountColumnInput) {
  const fieldKey = normalizeFieldKey(values.label);

  const { data: existing, error: existingError } = await supabase
    .from(ACCOUNT_COLUMNS_TABLE)
    .select("id")
    .eq("account_id", values.account_id)
    .eq("field_key", fieldKey)
    .is("deleted_at", null)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing) {
    throw new Error("A column with this label already exists.");
  }

  const { data: lastColumn, error: orderError } = await supabase
    .from(ACCOUNT_COLUMNS_TABLE)
    .select("display_order")
    .eq("account_id", values.account_id)
    .is("deleted_at", null)
    .order("display_order", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (orderError) {
    throw orderError;
  }

  const nextOrder = (lastColumn?.display_order ?? -1) + 1;

  if (values.is_amount_column) {
    const { error: amountError } = await supabase
      .from(ACCOUNT_COLUMNS_TABLE)
      .update({
        is_amount_column: false,
      })
      .eq("account_id", values.account_id)
      .is("deleted_at", null);

    if (amountError) {
      throw amountError;
    }
  }

  const { data, error } = await supabase
    .from(ACCOUNT_COLUMNS_TABLE)
    .insert({
      ...values,
      field_key: fieldKey,
      display_order: nextOrder,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as AccountColumn;
}

export async function updateAccountColumn(
  id: number,
  values: AccountColumnInput,
) {
  const { data: currentColumn, error: currentColumnError } = await supabase
    .from(ACCOUNT_COLUMNS_TABLE)
    .select("field_key")
    .eq("id", id)
    .eq("account_id", values.account_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (currentColumnError) {
    throw currentColumnError;
  }

  if (!currentColumn) {
    throw new Error("Column not found.");
  }

  if (values.is_amount_column) {
    const { error: amountError } = await supabase
      .from(ACCOUNT_COLUMNS_TABLE)
      .update({
        is_amount_column: false,
      })
      .eq("account_id", values.account_id)
      .neq("id", id)
      .is("deleted_at", null);

    if (amountError) {
      throw amountError;
    }
  }

  const { data, error } = await supabase
    .from(ACCOUNT_COLUMNS_TABLE)
    .update({
      ...values,
      field_key: currentColumn.field_key,
    })
    .eq("id", id)
    .eq("account_id", values.account_id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as AccountColumn;
}

export async function deleteAccountColumn({
  id,
  account_id,
}: DeleteAccountColumnInput) {
  const { error } = await supabase
    .from(ACCOUNT_COLUMNS_TABLE)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("account_id", account_id)
    .is("deleted_at", null);

  if (error) {
    throw error;
  }
}

export async function reorderAccountColumns({
  accountId,
  columns,
}: ReorderAccountColumnsInput): Promise<void> {
  if (!columns.length) {
    return;
  }

  const updates = columns.map(({ id, display_order }) =>
    supabase
      .from(ACCOUNT_COLUMNS_TABLE)
      .update({
        display_order,
      })
      .eq("id", id)
      .eq("account_id", accountId)
      .is("deleted_at", null),
  );

  const results = await Promise.all(updates);

  const failedResult = results.find((result) => result.error);

  if (failedResult?.error) {
    throw failedResult.error;
  }
}
