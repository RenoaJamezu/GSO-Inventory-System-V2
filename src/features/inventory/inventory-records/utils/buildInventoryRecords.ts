import type {
  InventoryRecordInput,
  InventoryType,
  PreviewRow,
} from "@/features/inventory/inventory-records";
import { normalizeCellValue } from "./normalizeCellValue";
import type { AccountColumn } from "@/features/inventory/account-columns";

export function buildInventoryRecords(
  rows: PreviewRow[],
  mapping: Record<string, string>,
  accountId: number,
  inventoryType: InventoryType,
  systemColumns: AccountColumn[],
): InventoryRecordInput[] {
  return rows
    .map((row) => {
      const data: Record<string, unknown> = {};

      Object.entries(mapping).forEach(([excelColumn, fieldKey]) => {
        if (!fieldKey) return;

        const column = systemColumns.find(
          (column) => column.field_key === fieldKey,
        );

        const value = normalizeCellValue(
          row.data[excelColumn],
          column?.data_type ?? "text",
        );

        if (
          value !== undefined &&
          value !== null &&
          !(typeof value === "string" && value.trim() === "")
        ) {
          data[fieldKey] = value;
        }
      });

      return {
        account_id: accountId,
        inventory_type: inventoryType,
        group_id: row.group_id,
        data,
      };
    })
    .filter((record) => Object.keys(record.data).length > 0);
}
