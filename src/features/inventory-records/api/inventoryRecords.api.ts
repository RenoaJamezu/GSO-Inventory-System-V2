import { supabase } from "@/lib/supabase";

import type { InventoryRecord, InventoryRecordInput } from "../types";

const TABLE = "inventory_records";

export async function getInventoryRecords(accountId: number) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("account_id", accountId)
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
    .single();

  if (error) throw error;

  return data as InventoryRecord;
}

export async function getInventoryRecordByUuid(uuid: string) {
  const { data, error } = await supabase
    .from("inventory_records")
    .select("*")
    .eq("qr_uuid", uuid)
    .single();

  if (error) throw error;

  return data;
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
