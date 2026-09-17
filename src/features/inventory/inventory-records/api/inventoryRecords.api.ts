import { supabase } from "@/lib/supabase";

import type {
  BulkAssignGroupInput,
  BulkDeleteInventoryRecordsInput,
  DeleteInventoryRecordInput,
  InventoryRecord,
  InventoryRecordInput,
  InventoryRecordUpdate,
  InventoryType,
  ReorderInventoryRecordsInput,
} from "../types";

const TABLE = "inventory_records";

async function getNextRecordSortOrder(
  accountId: number,
  inventoryType: InventoryType,
  groupId: number | null,
): Promise<number> {
  let query = supabase
    .from(TABLE)
    .select("sort_order")
    .eq("account_id", accountId)
    .eq("inventory_type", inventoryType)
    .is("deleted_at", null);

  query =
    groupId === null
      ? query.is("group_id", null)
      : query.eq("group_id", groupId);

  const { data, error } = await query
    .order("sort_order", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return (data?.sort_order ?? -1) + 1;
}

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
    .order("group_id", {
      ascending: true,
      nullsFirst: true,
    })
    .order("sort_order", {
      ascending: true,
    })
    .order("id", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data as InventoryRecord[];
}

export async function createInventoryRecord(values: InventoryRecordInput) {
  const sortOrder = await getNextRecordSortOrder(
    values.account_id,
    values.inventory_type,
    values.group_id,
  );

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

  return data as InventoryRecord;
}

export async function updateInventoryRecord({
  id,
  account_id,
  inventory_type,
  values,
}: InventoryRecordUpdate) {
  const { data: currentRecord, error: readError } = await supabase
    .from(TABLE)
    .select("group_id, sort_order")
    .eq("id", id)
    .eq("account_id", account_id)
    .eq("inventory_type", inventory_type)
    .is("deleted_at", null)
    .maybeSingle();

  if (readError) {
    throw readError;
  }

  if (!currentRecord) {
    throw new Error("Inventory record not found.");
  }

  let sortOrder = currentRecord.sort_order;

  if (values.group_id !== currentRecord.group_id) {
    sortOrder = await getNextRecordSortOrder(
      account_id,
      inventory_type,
      values.group_id,
    );
  }

  const { data, error } = await supabase
    .from(TABLE)
    .update({
      group_id: values.group_id,
      data: values.data,
      sort_order: sortOrder,
    })
    .eq("id", id)
    .eq("account_id", account_id)
    .eq("inventory_type", inventory_type)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data as InventoryRecord;
}

export async function deleteInventoryRecord({
  id,
  account_id,
  inventory_type,
}: DeleteInventoryRecordInput) {
  const { error } = await supabase
    .from(TABLE)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("account_id", account_id)
    .eq("inventory_type", inventory_type)
    .is("deleted_at", null);

  if (error) {
    throw error;
  }
}

export async function bulkCreateInventoryRecords(
  records: InventoryRecordInput[],
) {
  if (!records.length) {
    return [];
  }

  const groupedRecords = new Map<string, InventoryRecordInput[]>();

  for (const record of records) {
    const key = [
      record.account_id,
      record.inventory_type,
      record.group_id ?? "null",
    ].join(":");

    const existing = groupedRecords.get(key) ?? [];

    existing.push(record);
    groupedRecords.set(key, existing);
  }

  const recordsWithOrder: Array<
    InventoryRecordInput & {
      sort_order: number;
    }
  > = [];

  for (const groupRecords of groupedRecords.values()) {
    const firstRecord = groupRecords[0];

    if (!firstRecord) {
      continue;
    }

    const startingOrder = await getNextRecordSortOrder(
      firstRecord.account_id,
      firstRecord.inventory_type,
      firstRecord.group_id,
    );

    groupRecords.forEach((record, index) => {
      recordsWithOrder.push({
        ...record,
        sort_order: startingOrder + index,
      });
    });
  }

  const { data, error } = await supabase
    .from(TABLE)
    .insert(recordsWithOrder)
    .select();

  if (error) {
    throw error;
  }

  return data as InventoryRecord[];
}

export async function bulkDeleteInventoryRecords({
  ids,
  account_id,
  inventory_type,
}: BulkDeleteInventoryRecordsInput) {
  if (!ids.length) {
    return;
  }

  const { error } = await supabase
    .from(TABLE)
    .update({
      deleted_at: new Date().toISOString(),
    })
    .in("id", ids)
    .eq("account_id", account_id)
    .eq("inventory_type", inventory_type)
    .is("deleted_at", null);

  if (error) {
    throw error;
  }
}

export async function bulkAssignGroup({
  ids,
  account_id,
  inventory_type,
  group_id,
}: BulkAssignGroupInput) {
  if (!ids.length) {
    return;
  }

  const { data: records, error: readError } = await supabase
    .from(TABLE)
    .select("id")
    .in("id", ids)
    .eq("account_id", account_id)
    .eq("inventory_type", inventory_type)
    .is("deleted_at", null)
    .order("id");

  if (readError) {
    throw readError;
  }

  if (!records?.length) {
    return;
  }

  if (records.length !== ids.length) {
    throw new Error(
      "One or more selected inventory records are no longer available.",
    );
  }

  const startingOrder = await getNextRecordSortOrder(
    account_id,
    inventory_type,
    group_id,
  );

  const updates = records.map((record, index) =>
    supabase
      .from(TABLE)
      .update({
        group_id,
        sort_order: startingOrder + index,
        updated_at: new Date().toISOString(),
      })
      .eq("id", record.id)
      .eq("account_id", account_id)
      .eq("inventory_type", inventory_type)
      .is("deleted_at", null),
  );

  const results = await Promise.all(updates);
  const failedResult = results.find((result) => result.error);

  if (failedResult?.error) {
    throw failedResult.error;
  }
}

export async function reorderInventoryRecords({
  accountId,
  inventoryType,
  groupId,
  records,
}: ReorderInventoryRecordsInput): Promise<void> {
  if (!records.length) {
    return;
  }

  const ids = records.map((record) => record.id);

  let validationQuery = supabase
    .from(TABLE)
    .select("id, group_id")
    .eq("account_id", accountId)
    .eq("inventory_type", inventoryType)
    .in("id", ids)
    .is("deleted_at", null);

  validationQuery =
    groupId === null
      ? validationQuery.is("group_id", null)
      : validationQuery.eq("group_id", groupId);

  const { data: validRecords, error: validationError } = await validationQuery;

  if (validationError) {
    throw validationError;
  }

  if (validRecords?.length !== records.length) {
    throw new Error(
      "Inventory records can only be reordered within their current group.",
    );
  }

  const updates = records.map(({ id, sort_order }) =>
    supabase
      .from(TABLE)
      .update({
        sort_order,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("account_id", accountId)
      .eq("inventory_type", inventoryType)
      .is("deleted_at", null),
  );

  const results = await Promise.all(updates);

  const failedResult = results.find((result) => result.error);

  if (failedResult?.error) {
    throw failedResult.error;
  }
}
