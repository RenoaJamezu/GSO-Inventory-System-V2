import { supabase } from "@/lib/supabase";

import type { Group, GroupInput } from "../types";

const TABLE = "groups";

export async function getGroups(accountId: number) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("account_id", accountId)
    .is("deleted_at", null)
    .order("sort_order")
    .order("id");

  if (error) throw error;

  return data as Group[];
}

export async function getGroup(id: number) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;

  return data as Group;
}

export async function createGroup(values: GroupInput) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data as Group;
}

export async function updateGroup(id: number, values: Partial<GroupInput>) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as Group;
}

export async function deleteGroup(id: number) {
  const { error } = await supabase.rpc("delete_group_and_unassign_records", {
    p_group_id: id,
  });

  if (error) throw error;
}
