import * as XLSX from "xlsx";

import {
  buildInventoryAccountSheet,
  downloadWorkbook,
  getSafeSheetName,
} from "@/features/inventory/export";

import type { InventoryTableLayout } from "../table-layout";

type ExportInventoryRecordsParams = {
  layout: InventoryTableLayout;
  accountTitle: string;
};

function sanitizeFileName(value: string): string {
  const sanitized = value
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return sanitized || "Inventory Records";
}

export function exportInventoryRecords({
  layout,
  accountTitle,
}: ExportInventoryRecordsParams) {
  if (layout.columnCount === 0) {
    return;
  }

  const workbook = XLSX.utils.book_new();

  const worksheet = buildInventoryAccountSheet(layout);

  const sheetName = getSafeSheetName(
    accountTitle || "Inventory Records",
    new Set<string>(),
  );

  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const safeAccountTitle = sanitizeFileName(accountTitle);

  downloadWorkbook(workbook, `${safeAccountTitle} - Inventory Report.xlsx`);
}
