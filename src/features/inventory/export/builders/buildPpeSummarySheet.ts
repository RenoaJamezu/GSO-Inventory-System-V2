import * as XLSX from "xlsx";

import type { InventoryReportAccount } from "../types";

import { getInventoryLayoutTotal } from "../utils/getInventoryLayoutTotal";

const CURRENCY_NUMBER_FORMAT = "₱#,##0.00";

export function buildPpeSummarySheet(
  accounts: InventoryReportAccount[],
): XLSX.WorkSheet {
  const rows = [
    ["No.", "Account Title", "Book Value", "Per Inventory Report", "Variance"],
    ...accounts.map((reportAccount, index) => [
      index + 1,
      reportAccount.account.account_title,
      reportAccount.account.book_value ?? 0,
      getInventoryLayoutTotal(reportAccount.layout),
      reportAccount.account.variance ?? 0,
    ]),
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 8 },
    { wch: 40 },
    { wch: 20 },
    { wch: 24 },
    { wch: 20 },
  ];

  for (let row = 2; row <= rows.length; row += 1) {
    for (const column of ["C", "D", "E"]) {
      const cell = worksheet[`${column}${row}`];

      if (cell) {
        cell.z = CURRENCY_NUMBER_FORMAT;
      }
    }
  }

  return worksheet;
}
