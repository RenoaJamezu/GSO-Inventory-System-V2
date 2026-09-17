import type { AccountColumn } from "@/features/inventory/account-columns";

export function getRecordAmount(
  columns: AccountColumn[],
  data: Record<string, unknown>,
): number | undefined {
  const amountColumn = columns.find((column) => column.is_amount_column);

  if (!amountColumn) {
    return undefined;
  }

  const rawValue = data[amountColumn.field_key];

  if (
    rawValue === null ||
    rawValue === undefined ||
    rawValue === "" ||
    typeof rawValue === "boolean"
  ) {
    return undefined;
  }

  const value = Number(rawValue);

  return Number.isFinite(value) ? value : undefined;
}
