import type { AccountColumn } from "@/features/account-columns";

export function getRecordAmount(
  columns: AccountColumn[],
  data: Record<string, unknown>,
): number | undefined {
  const amountColumn = columns.find((column) => column.is_amount_column);

  if (!amountColumn) {
    return undefined;
  }

  const value = Number(data[amountColumn.field_key]);

  return Number.isNaN(value) ? undefined : value;
}
