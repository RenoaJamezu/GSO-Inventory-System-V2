import { formatNumber } from "@/lib/utils/format";

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

    if (["true", "yes", "y", "1"].includes(normalized)) {
      return "Yes";
    }

    if (["false", "no", "n", "0"].includes(normalized)) {
      return "No";
    }
  }

  return String(value);
}

function formatPublicNumber(value: unknown): string {
  if (typeof value === "boolean") {
    return String(value);
  }

  const numericValue =
    typeof value === "number"
      ? value
      : Number(String(value).replace(/,/g, "").trim());

  return Number.isFinite(numericValue)
    ? formatNumber(numericValue)
    : String(value);
}

export function renderPublicValue(value: unknown, type: string) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  switch (type) {
    case "boolean":
      return formatBoolean(value);

    case "number":
      return formatPublicNumber(value);

    case "date":
      return String(value);

    default:
      return String(value);
  }
}
