export function formatNumber(value: number | string |null | undefined) {
  return Number(value ?? 0).toLocaleString();
}

export function formatCurrency(value: number | string | null | undefined) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
  }).format(Number(value ?? 0));
}