import { supabase } from "@/lib/supabase";

import type {
  DeleteGroupInput,
  Group,
  GroupInput,
  ReorderGroupsInput,
  UpdateGroupInput,
} from "../types";

const TABLE = "groups";

export async function getGroups(accountId: number) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("account_id", accountId)
    .is("deleted_at", null)
    .order("sort_order", {
      ascending: true,
    })
    .order("id", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data as Group[];
}

export async function createGroup(values: GroupInput) {
  let sortOrder = values.sort_order;

  if (sortOrder === undefined) {
    const { data: lastGroup, error: orderError } = await supabase
      .from(TABLE)
      .select("sort_order")
      .eq("account_id", values.account_id)
      .is("deleted_at", null)
      .order("sort_order", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (orderError) {
      throw orderError;
    }

    sortOrder = (lastGroup?.sort_order ?? -1) + 1;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert({
      ...values,
      sort_order: sortOrder,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Group;
}

export async function updateGroup({
  id,
  account_id,
  values,
}: UpdateGroupInput) {
  const { data, error } = await supabase
    .from(TABLE)
    .update({
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("account_id", account_id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as Group;
}

export async function deleteGroup({
  id,
  account_id,
}: DeleteGroupInput): Promise<void> {
  const { data: group, error: validationError } = await supabase
    .from(TABLE)
    .select("id")
    .eq("id", id)
    .eq("account_id", account_id)
    .is("deleted_at", null)
    .maybeSingle();

  if (validationError) {
    throw validationError;
  }

  if (!group) {
    throw new Error("Inventory group not found.");
  }

  const { error } = await supabase.rpc("delete_group_and_unassign_records", {
    p_group_id: id,
  });

  if (error) {
    throw error;
  }
}

export async function reorderGroups({
  accountId,
  groups,
}: ReorderGroupsInput): Promise<void> {
  if (!groups.length) {
    return;
  }

  const ids = groups.map((group) => group.id);

  if (new Set(ids).size !== ids.length) {
    throw new Error("Duplicate inventory groups cannot be reordered.");
  }

  const { data: validGroups, error: validationError } = await supabase
    .from(TABLE)
    .select("id")
    .eq("account_id", accountId)
    .in("id", ids)
    .is("deleted_at", null);

  if (validationError) {
    throw validationError;
  }

  if (validGroups?.length !== groups.length) {
    throw new Error(
      "One or more inventory groups are no longer available for this account.",
    );
  }

  const updates = groups.map(({ id, sort_order }) =>
    supabase
      .from(TABLE)
      .update({
        sort_order,
        updated_at: new Date().toISOString(),
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
