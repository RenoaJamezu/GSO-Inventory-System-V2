export function normalizeCellValue(value: unknown, dataType: string): unknown {
  if (value === null || value === undefined) {
    return "";
  }

  switch (dataType) {
    case "number":
    case "amount": {
      if (typeof value === "number") return value;

      const cleaned = String(value).replace(/₱/g, "").replace(/,/g, "").trim();

      const parsed = Number(cleaned);

      return Number.isNaN(parsed) ? "" : parsed;
    }

    case "boolean": {
      if (typeof value === "boolean") {
        return value;
      }

      const normalized = String(value).trim().toLowerCase();

      if (["true", "yes", "y", "1"].includes(normalized)) {
        return true;
      }

      if (["false", "no", "n", "0"].includes(normalized)) {
        return false;
      }

      return "";
    }

    case "date": {
      return String(value).trim();
    }

    default:
      return String(value).trim();
  }
}
