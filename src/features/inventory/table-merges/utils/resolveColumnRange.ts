import type { InventoryTableColumn } from "../../inventory-records/table-layout";

interface ResolveColumnRangeParams {
  columns: InventoryTableColumn[];
  startColumnId: number;
  endColumnId: number;
}

export function resolveColumnRange({
  columns,
  startColumnId,
  endColumnId,
}: ResolveColumnRangeParams): InventoryTableColumn[] {
  const startIndex = columns.findIndex((column) => column.id === startColumnId);
  const endIndex = columns.findIndex((column) => column.id === endColumnId);

  if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
    return [];
  }

  return columns.slice(startIndex, endIndex + 1);
}
