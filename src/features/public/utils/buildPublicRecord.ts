import type { AccountColumn } from "@/features/inventory/account-columns";
import type { InventoryAccount } from "@/features/inventory/inventory-accounts";
import type { Group } from "@/features/inventory/inventory-records";
import type { InventoryRecord } from "@/features/inventory/inventory-records";
import type { PublicInventoryRecord } from "../types";

export function buildPublicRecord(
  record: InventoryRecord,
  account: InventoryAccount,
  columns: AccountColumn[],
  group: Group | null,
): PublicInventoryRecord {
  const sortedColumns = [...columns].sort(
    (a, b) => a.display_order - b.display_order,
  );

  const amountColumn = columns.find((column) => column.is_amount_column);

  const amount = amountColumn
    ? Number(record.data[amountColumn.field_key] ?? 0)
    : 0;

  return {
    id: record.id,
    qr_uuid: record.qr_uuid,

    account_id: account.id,
    account_title: account.account_title,

    group_id: group?.id ?? null,
    group_name: group?.group_name ?? null,

    created_at: record.created_at,

    data: record.data,

    amount,

    columns: sortedColumns.map((column) => ({
      field_key: column.field_key,
      label: column.label,
      data_type: column.data_type,
      display_order: column.display_order,
    })),
  };
}
