import type { InventoryTableLayout } from "../../inventory-records/table-layout";

export function getInventoryLayoutTotal(layout: InventoryTableLayout): number {
  const amountColumnIndex = layout.columns.findIndex(
    (column) => column.isAmountColumn,
  );

  if (amountColumnIndex === -1) {
    return 0;
  }

  let total = 0;

  for (const group of layout.groups) {
    for (const row of group.rows) {
      const cell = row.cells[amountColumnIndex];

      if (!cell) {
        continue;
      }

      const value = Number(cell.value);

      if (Number.isFinite(value)) {
        total += value;
      }
    }
  }

  return total;
}
