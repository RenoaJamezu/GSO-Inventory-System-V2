import * as XLSX from "xlsx";
import type { AccountColumn } from "../../account-columns/types";
import type { InventoryRecord } from "../types";

function sanitizeFileName(value: string): string {
  return value
    .replace(/[<>:"/\\|?*]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeSheetName(value: string): string {
  return (
    value
      .replace(/[\]:*?/\\]/g, "")
      .trim()
      .slice(0, 31) || "Inventory Records"
  );
}

function formatCellValue(
  value: unknown,
  dataType: AccountColumn["data_type"],
): unknown {
  if (value === null || value === undefined || value === "") {
    return "";
  }

  if (dataType === "boolean") {
    return value === true || value === "true" ? "Yes" : "No";
  }

  if (dataType === "number") {
    if (typeof value === "number") {
      return value;
    }

    const numberValue = Number(value);

    return Number.isNaN(numberValue) ? value : numberValue;
  }

  return value;
}

type ExportInventoryRecordsParams = {
  records: InventoryRecord[];
  columns: AccountColumn[];
  accountTitle: string;
};

export function exportInventoryRecords({
  records,
  columns,
  accountTitle,
}: ExportInventoryRecordsParams) {
  if (records.length === 0 || columns.length === 0) {
    return;
  }

  const headers = columns.map((column) => column.label);

  const rows = records.map((record) =>
    columns.map((column) =>
      formatCellValue(
        record.data?.[column.field_key],
        column.data_type,
      ),
    ),
  );

  const worksheet = XLSX.utils.aoa_to_sheet([
    headers,
    ...rows,
  ]);

  worksheet["!cols"] = columns.map((column, columnIndex) => {
    let maxLength = String(column.label ?? "").length;

    rows.forEach((row) => {
      const value = row[columnIndex];
      const length = String(value ?? "").length;

      if (length > maxLength) {
        maxLength = length;
      }
    });

    return {
      wch: Math.min(Math.max(maxLength + 2, 10), 40),
    };
  });

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(
    workbook,
    worksheet,
    sanitizeSheetName(accountTitle),
  );

  const fileName = `${sanitizeFileName(
    accountTitle || "Inventory Records",
  )} - Inventory Records.xlsx`;

  XLSX.writeFile(workbook, fileName);
}