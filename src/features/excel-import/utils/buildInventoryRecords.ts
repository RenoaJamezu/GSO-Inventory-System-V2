import type {
  InventoryRecordInput,
  PreviewRow,
} from "@/features/inventory-records";

export function buildInventoryRecords(
  rows: PreviewRow[],
  mapping: Record<string, string>,
  accountId: number,
): InventoryRecordInput[] {
  return rows
    .map((row) => {
      const data: Record<string, unknown> = {};

      Object.entries(mapping).forEach(([excelColumn, fieldKey]) => {
        if (!fieldKey) return;

        const value = row.data[excelColumn];

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
