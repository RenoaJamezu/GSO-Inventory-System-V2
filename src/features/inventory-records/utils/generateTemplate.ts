import * as XLSX from "xlsx";
import type { AccountColumn } from "@/features/account-columns";

export function generateTemplate(columns: AccountColumn[]) {
  const headers = columns
    .sort((a, b) => a.display_order - b.display_order)
    .map((c) => c.label);

  const worksheet = XLSX.utils.aoa_to_sheet([headers]);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

  XLSX.writeFile(workbook, "inventory-template.xlsx");
}
