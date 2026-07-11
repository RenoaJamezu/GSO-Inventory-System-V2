export function normalizeCellValue(value: unknown, dataType: string): unknown {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value !== "string") {
    return value;
  }

  const trimmed = value.trim();

  switch (dataType) {
    case "number":
    case "amount":
      return Number(
        trimmed.replace(/₱/g, "").replace(/,/g, "").replace(/\s/g, ""),
      );

    default:
      return trimmed;
  }
}
