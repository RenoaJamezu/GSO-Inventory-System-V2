import { supabase } from "@/lib/supabase";

import type {
  InventoryRecord,
  InventoryRecordInput,
  InventoryType,
} from "../types";

const TABLE = "inventory_records";

export async function getInventoryRecords(
  accountId: number,
  inventoryType: InventoryType,
) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("account_id", accountId)
    .eq("inventory_type", inventoryType)
    .is("deleted_at", null)
    .order("id");

  if (error) throw error;

  return data as InventoryRecord[];
}

export async function getInventoryRecord(id: number) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) throw error;

  return data as InventoryRecord;
}

export async function getInventoryRecordByUuid(uuid: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("qr_uuid", uuid)
    .is("deleted_at", null)
    .single();

  if (error) throw error;

  return data as InventoryRecord;
}

export async function createInventoryRecord(values: InventoryRecordInput) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data as InventoryRecord;
}

export async function updateInventoryRecord(
  id: number,
  values: Partial<InventoryRecordInput>,
) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(values)
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) throw error;

  return data as InventoryRecord;
}

export async function deleteInventoryRecord(id: number) {
  const { error } = await supabase
    .from(TABLE)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw error;
}

export async function bulkCreateInventoryRecords(
  records: InventoryRecordInput[],
) {
  const { data, error } = await supabase.from(TABLE).insert(records).select();

  if (error) throw error;

  return data;
}

export async function bulkDeleteInventoryRecords(ids: number[]) {
  if (!ids.length) return;

  const { error } = await supabase
    .from(TABLE)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .in("id", ids);

  if (error) throw error;
}

export async function bulkAssignGroup(ids: number[], groupId: number | null) {
  if (!ids.length) return;

  const { error } = await supabase
    .from(TABLE)
    .update({
      group_id: groupId,
    })
    .in("id", ids)
    .is("deleted_at", null);

  if (error) throw error;
}
