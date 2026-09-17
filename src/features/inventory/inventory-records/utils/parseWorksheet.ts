import * as XLSX from "xlsx";

export function parseWorksheet(
  workbook: XLSX.WorkBook,
  sheetName: string,
  headerRow = 1,
) {
  const worksheet = workbook.Sheets[sheetName];

  if (!worksheet) {
    return [];
  }

  return XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet, {
    defval: "",
    raw: false,
    range: Math.max(0, headerRow - 1),
  });
}
