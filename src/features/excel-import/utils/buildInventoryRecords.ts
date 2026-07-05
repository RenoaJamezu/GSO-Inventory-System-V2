import type {
  InventoryRecordInput,
  PreviewRow,
} from "@/features/inventory-records";
import { normalizeCellValue } from "./normalizeCellValue";
import type { AccountColumn } from "@/features/account-columns";

export function buildInventoryRecords(
  rows: PreviewRow[],
  mapping: Record<string, string>,
  accountId: number,
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
          String(value).trim() !== ""
        ) {
          data[fieldKey] = value;
        }
      });

      return {
        account_id: accountId,
        group_id: row.group_id,
        data,
      };
    })
    .filter((record) => Object.keys(record.data).length > 0);
}
