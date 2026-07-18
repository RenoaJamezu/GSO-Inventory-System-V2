import type { AccountColumn } from "@/features/inventory/account-columns";

export function renderFieldValue(
  value: unknown,
  column: AccountColumn["data_type"],
) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  switch (column) {
    case "boolean":
      return (value) ? "Yes" : "No";

    case "date": {
      const date = new Date(String(value));

      return Number.isNaN(date.getTime())
        ? String(value)
        : date.toLocaleDateString();
    }

    case "number": {
      const number = Number(value);

      return Number.isNaN(number)
        ? String(value)
        : number.toLocaleString();
    }

    default:
      return String(value);
  }
}