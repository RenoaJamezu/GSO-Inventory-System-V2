import * as XLSX from "xlsx";

import {
  buildHeaderRows,
  type InventoryTableHeaderCell,
  type InventoryTableLayout,
} from "../../inventory-records/table-layout";
import { getInventoryLayoutTotal } from "../utils/getInventoryLayoutTotal";

const CURRENCY_NUMBER_FORMAT = "₱#,##0.00";
const NUMBER_FORMAT = "#,##0.00";

function normalizeCellValue(value: unknown) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (typeof value === "string" || typeof value === "number") {
    return value;
  }

  return String(value);
}

function writeHeaderRow(
  worksheet: XLSX.WorkSheet,
  cells: InventoryTableHeaderCell[],
  rowIndex: number,
  startColumnIndex: number,
) {
  let columnIndex = startColumnIndex;

  for (const cell of cells) {
    const address = XLSX.utils.encode_cell({
      r: rowIndex,
      c: columnIndex,
    });

    worksheet[address] = {
      t: "s",
      v: cell.label,
    };

    columnIndex += cell.colSpan;
  }
}

function buildHeaderMerges(
  headerRows: ReturnType<typeof buildHeaderRows>,
): XLSX.Range[] {
  if (!headerRows.hasGroups) {
    return [];
  }

  const merges: XLSX.Range[] = [];

  let topColumnIndex = 0;

  for (const cell of headerRows.top) {
    const startColumn = topColumnIndex;
    const endColumn = startColumn + cell.colSpan - 1;

    if (cell.colSpan > 1 || cell.rowSpan > 1) {
      merges.push({
        s: {
          r: 0,
          c: startColumn,
        },
        e: {
          r: cell.rowSpan - 1,
          c: endColumn,
        },
      });
    }

    topColumnIndex += cell.colSpan;
  }

  return merges;
}

export function buildInventoryAccountSheet(
  layout: InventoryTableLayout,
): XLSX.WorkSheet {
  const headerRows = buildHeaderRows({
    columns: layout.columns,
    headerGroups: layout.headerGroups,
  });

  const worksheet: XLSX.WorkSheet = {};

  // --------------------------------------------------
  // Headers
  // --------------------------------------------------

  writeHeaderRow(worksheet, headerRows.top, 0, 0);

  if (headerRows.hasGroups) {
    for (const cell of headerRows.bottom) {
      if (cell.columnId === undefined) {
        continue;
      }

      const columnIndex = layout.columns.findIndex(
        (column) => column.id === cell.columnId,
      );

      if (columnIndex === -1) {
        continue;
      }

      const address = XLSX.utils.encode_cell({
        r: 1,
        c: columnIndex,
      });

      worksheet[address] = {
        t: "s",
        v: cell.label,
      };
    }
  }

  const merges = buildHeaderMerges(headerRows);

  const headerRowCount = headerRows.hasGroups ? 2 : 1;

  let excelRowIndex = headerRowCount;

  // --------------------------------------------------
  // Records
  // --------------------------------------------------

  for (const group of layout.groups) {
    if (group.id !== null) {
      const groupAddress = XLSX.utils.encode_cell({
        r: excelRowIndex,
        c: 0,
      });

      worksheet[groupAddress] = {
        t: "s",
        v: group.name,
      };

      if (layout.columnCount > 1) {
        merges.push({
          s: {
            r: excelRowIndex,
            c: 0,
          },
          e: {
            r: excelRowIndex,
            c: layout.columnCount - 1,
          },
        });
      }

      excelRowIndex += 1;
    }

    for (const row of group.rows) {
      row.cells.forEach((cell, columnIndex) => {
        const column = layout.columns[columnIndex];

        if (!column) {
          return;
        }

        const address = XLSX.utils.encode_cell({
          r: excelRowIndex,
          c: columnIndex,
        });

        const value = normalizeCellValue(cell.value);

        if (column.dataType === "number") {
          const numericValue = Number(cell.value);

          if (Number.isFinite(numericValue)) {
            worksheet[address] = {
              t: "n",
              v: numericValue,
              z: column.isAmountColumn ? CURRENCY_NUMBER_FORMAT : NUMBER_FORMAT,
            };

            return;
          }
        }

        worksheet[address] = {
          t: "s",
          v: String(value),
        };
      });

      excelRowIndex += 1;
    }
  }

  // --------------------------------------------------
  // Total
  // --------------------------------------------------

  const amountColumnIndex = layout.columns.findIndex(
    (column) => column.isAmountColumn,
  );

  if (amountColumnIndex !== -1) {
    const totalAmount = getInventoryLayoutTotal(layout);

    const labelColumnIndex = Math.max(0, amountColumnIndex - 1);

    const labelAddress = XLSX.utils.encode_cell({
      r: excelRowIndex,
      c: labelColumnIndex,
    });

    worksheet[labelAddress] = {
      t: "s",
      v: "TOTAL",
    };

    const totalAddress = XLSX.utils.encode_cell({
      r: excelRowIndex,
      c: amountColumnIndex,
    });

    worksheet[totalAddress] = {
      t: "n",
      v: totalAmount,
      z: CURRENCY_NUMBER_FORMAT,
    };

    excelRowIndex += 1;
  }

  // --------------------------------------------------
  // Worksheet metadata
  // IMPORTANT: this must happen AFTER records + TOTAL
  // --------------------------------------------------

  worksheet["!merges"] = merges;

  worksheet["!cols"] = layout.columns.map((column) => ({
    wch: Math.max(14, Math.min(35, column.label.length + 4)),
  }));

  if (layout.columnCount > 0) {
    worksheet["!ref"] = XLSX.utils.encode_range({
      s: {
        r: 0,
        c: 0,
      },
      e: {
        r: Math.max(0, excelRowIndex - 1),
        c: layout.columnCount - 1,
      },
    });
  }

  return worksheet;
}
