import * as XLSX from "xlsx";
import type { AccountColumn } from "@/features/account-columns";
import type { InventoryAccount } from "@/features/inventory-accounts";

export function generateTemplate(
  columns: AccountColumn[],
  account: InventoryAccount,
) {
  const sortedColumns = [...columns].sort(
    (a, b) => a.display_order - b.display_order,
  );

  const headers = sortedColumns.map((column) => column.label);

  const worksheet = XLSX.utils.aoa_to_sheet([headers]);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Template");

  XLSX.writeFile(workbook, `${account.account_title} Template.xlsx`);
}
