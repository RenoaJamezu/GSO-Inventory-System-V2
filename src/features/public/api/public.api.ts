import { supabase } from "@/lib/supabase";

import type { PublicInventoryRecord } from "../types";

const TABLE = "public_inventory_records";

export async function getPublicInventoryRecord(
  uuid: string,
): Promise<PublicInventoryRecord | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("qr_uuid", uuid)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as PublicInventoryRecord | null;
}
