import type { AccountColumn } from "@/features/inventory/account-columns";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

interface RenderFieldValueOptions {
  isAmountColumn?: boolean;
}

function formatBoolean(value: unknown): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "number") {
    if (value === 1) {
      return "Yes";
    }

    if (value === 0) {
      return "No";
    }
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (["true", "yes", "1"].includes(normalized)) {
      return "Yes";
    }

    if (["false", "no", "0"].includes(normalized)) {
      return "No";
    }
  }

  return String(value);
}

export function renderFieldValue(
  value: unknown,
  dataType: AccountColumn["data_type"],
  options: RenderFieldValueOptions = {},
): string {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  if (options.isAmountColumn) {
    const numericValue = Number(value);

    return Number.isFinite(numericValue)
      ? formatCurrency(numericValue)
      : String(value);
  }

  switch (dataType) {
    case "boolean":
      return formatBoolean(value);

    case "date": {
      const date = new Date(String(value));

      return Number.isNaN(date.getTime())
        ? String(value)
        : date.toLocaleDateString("en-PH");
    }

    case "number": {
      const numericValue = Number(value);

      return Number.isFinite(numericValue)
        ? formatNumber(numericValue)
        : String(value);
    }

    default:
      return String(value);
  }
}
