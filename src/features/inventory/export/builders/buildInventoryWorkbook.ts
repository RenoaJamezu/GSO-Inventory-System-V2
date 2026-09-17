import * as XLSX from "xlsx";

import type { InventoryReportAccount } from "../types";

import { buildInventoryAccountSheet } from "./buildInventoryAccountSheet";
import { buildPpeSummarySheet } from "./buildPpeSummarySheet";
import { getSafeSheetName } from "../utils/getSafeSheetName";

export function buildInventoryWorkbook(
  accounts: InventoryReportAccount[],
): XLSX.WorkBook {
  const workbook = XLSX.utils.book_new();
  const usedSheetNames = new Set<string>();

  const summarySheetName = getSafeSheetName("PPE's", usedSheetNames);

  const summarySheet = buildPpeSummarySheet(accounts);

  XLSX.utils.book_append_sheet(workbook, summarySheet, summarySheetName);

  for (const reportAccount of accounts) {
    const sheetName = getSafeSheetName(
      reportAccount.account.account_title,
      usedSheetNames,
    );

    const worksheet = buildInventoryAccountSheet(reportAccount.layout);

    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  return workbook;
}
