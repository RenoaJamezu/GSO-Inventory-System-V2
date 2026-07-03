import { supabase } from "@/lib/supabase";

import type { PublicInventoryRecord } from "../types";

const TABLE = "public_inventory_records";

export async function getPublicInventoryRecord(uuid: string) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("qr_uuid", uuid)
    .single();

  if (error) throw error;

  return data as PublicInventoryRecord;
}

export async function getPublicInventoryRecordsByIds(ids: number[]) {
  const { data, error } = await supabase
    .from("public_inventory_records")
    .select("*")
    .in("id", ids)
    .order("id");

  if (error) throw error;

  return data;
}
