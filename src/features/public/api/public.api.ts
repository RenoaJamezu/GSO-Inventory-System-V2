import { supabase } from "@/lib/supabase";

import type { AccountColumn } from "@/features/inventory/account-columns";
import type { InventoryAccount } from "@/features/inventory/inventory-accounts";
import {
  type Group,
  type InventoryRecord,
} from "@/features/inventory/inventory-records";

import { buildPublicRecord } from "../utils/buildPublicRecord";

export async function getPublicInventoryRecord(uuid: string) {
  const { data: record, error: recordError } = await supabase
    .from("inventory_records")
    .select("*")
    .eq("qr_uuid", uuid)
    .is("deleted_at", null)
    .single();

  if (recordError) throw recordError;

  const [accountResult, columnsResult, groupResult] = await Promise.all([
    supabase
      .from("inventory_accounts")
      .select("*")
      .eq("id", record.account_id)
      .is("deleted_at", null)
      .single(),

    supabase
      .from("account_columns")
      .select("*")
      .eq("account_id", record.account_id)
      .is("deleted_at", null)
      .order("display_order"),

    record.group_id
      ? supabase
          .from("groups")
          .select("*")
          .eq("id", record.group_id)
          .is("deleted_at", null)
          .single()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (accountResult.error) {
    throw accountResult.error;
  }

  if (columnsResult.error) {
    throw columnsResult.error;
  }

  if (groupResult.error && groupResult.error.code !== "PGRST116") {
    throw groupResult.error;
  }

  const account = accountResult.data;
  const columns = columnsResult.data;
  const group = groupResult.data as Group | null;

  return buildPublicRecord(
    record as InventoryRecord,
    account as InventoryAccount,
    columns as AccountColumn[],
    group,
  );
}

export async function getPublicInventoryRecordsByIds(ids: number[]) {
  const promises = ids.map((id) =>
    supabase.from("inventory_records").select("qr_uuid").eq("id", id).single(),
  );

  const responses = await Promise.all(promises);

  const uuids = responses
    .map((response) => response.data?.qr_uuid)
    .filter(Boolean) as string[];

  return Promise.all(uuids.map(getPublicInventoryRecord));
}
