export function renderPublicValue(value: unknown, type: string) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  switch (type) {
    case "boolean":
      return value ? "Yes" : "No";

    case "number":
      return Number(value).toLocaleString();

    case "date": {
      const date = new Date(String(value));

      return Number.isNaN(date.getTime())
        ? String(value)
        : date.toLocaleDateString();
    }

    default:
      return String(value);
  }
}
