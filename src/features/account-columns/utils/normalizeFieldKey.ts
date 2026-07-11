export function normalizeFieldKey(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_");
}
