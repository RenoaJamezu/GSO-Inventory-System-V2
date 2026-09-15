export type NumericValue = number | string | null | undefined;

const NUMBER_FORMATTER = new Intl.NumberFormat("en-PH");

const CURRENCY_FORMATTER = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function toFiniteNumber(value: NumericValue): number {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const numericValue = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numericValue) ? numericValue : 0;
}

export function formatNumber(value: NumericValue): string {
  return NUMBER_FORMATTER.format(toFiniteNumber(value));
}

export function formatCurrency(value: NumericValue): string {
  return CURRENCY_FORMATTER.format(toFiniteNumber(value));
}
