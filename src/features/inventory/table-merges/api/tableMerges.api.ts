import { supabase } from "@/lib/supabase";

import type {
  AccountColumnGroup,
  AccountColumnGroupInput,
  DeleteAccountColumnGroupInput,
} from "../types";

const COLUMN_GROUP_TABLE = "account_column_groups";

export async function getAccountColumnGroups(accountId: number) {
  const { data, error } = await supabase
    .from(COLUMN_GROUP_TABLE)
    .select("*")
    .eq("account_id", accountId)
    .is("deleted_at", null)
    .order("id", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data as AccountColumnGroup[];
}

export async function createAccountColumnGroup(
  values: AccountColumnGroupInput,
) {
  const { data, error } = await supabase
    .from(COLUMN_GROUP_TABLE)
    .insert(values)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as AccountColumnGroup;
}

export async function updateAccountColumnGroup(
  id: number,
  values: AccountColumnGroupInput,
) {
  const { data, error } = await supabase
    .from(COLUMN_GROUP_TABLE)
    .update({
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("account_id", values.account_id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as AccountColumnGroup;
}

export async function deleteAccountColumnGroup({
  id,
  account_id,
}: DeleteAccountColumnGroupInput) {
  const { error } = await supabase
    .from(COLUMN_GROUP_TABLE)
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
