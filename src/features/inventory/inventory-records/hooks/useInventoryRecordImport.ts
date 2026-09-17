import { useState } from "react";

import type { AccountColumn } from "@/features/inventory/account-columns";

import {
  type ColumnMapping,
  type ExcelWorkbook,
  type InventoryType,
  type PreviewRow,
} from "../types";
import { buildInventoryRecords } from "../utils/buildInventoryRecords";
import { createAutoMapping } from "../utils/createAutoMapping";
import { parseWorksheet } from "../utils/parseWorksheet";
import { readWorkbook } from "../utils/readWorkbook";
import { validateImportRows } from "../utils/validateImportRows";

import { useBulkInsertInventoryRecords } from "./useInventoryRecords";

type Params = {
  accountId: number;
  inventoryType: InventoryType;
  columns: AccountColumn[];
  onClose: () => void;
};

export function useInventoryRecordImport({
  accountId,
  inventoryType,
  columns,
  onClose,
}: Params) {
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<ExcelWorkbook | null>(null);
  const [sheetName, setSheetName] = useState("");
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({});
  const [headerRow, setHeaderRow] = useState(1);
  const [importError, setImportError] = useState<string | null>(null);

  const bulkInsert = useBulkInsertInventoryRecords();

  function reset() {
    setFile(null);
    setWorkbook(null);
    setSheetName("");
    setHeaderRow(1);
    setRows([]);
    setExcelColumns([]);
    setMapping({});
    setImportError(null);
  }

  function createPreviewRows(parsed: Record<string, unknown>[]) {
    const preview: PreviewRow[] = parsed.map((row) => ({
      id: crypto.randomUUID(),
      group_id: null,
      data: row,
    }));

    setRows(preview);

    if (parsed.length > 0) {
      setExcelColumns(Object.keys(parsed[0]));
    } else {
      setExcelColumns([]);
      setMapping({});
    }
  }

  function parseSelectedWorksheet(
    workbook: ExcelWorkbook,
    sheet: string,
    row: number,
  ) {
    const parsed = parseWorksheet(workbook, sheet, row);

    createPreviewRows(parsed);
    setMapping(createAutoMapping(Object.keys(parsed[0] ?? {}), columns));
    setImportError(null);
  }

  async function handleFile(file: File) {
    setImportError(null);
    setFile(file);

    try {
      const wb = await readWorkbook(file);

      setWorkbook(wb);

      if (!wb.SheetNames.length) {
        setSheetName("");
        setRows([]);
        setExcelColumns([]);
        setMapping({});
        setImportError(
          "The selected workbook does not contain any worksheets.",
        );
        return;
      }

      const firstSheet = wb.SheetNames[0];

      setSheetName(firstSheet);
      setHeaderRow(1);

      parseSelectedWorksheet(wb, firstSheet, 1);
    } catch (error) {
      console.error("Failed reading inventory workbook", error);

      setWorkbook(null);
      setSheetName("");
      setRows([]);
      setExcelColumns([]);
      setMapping({});
      setImportError(
        error instanceof Error
          ? error.message
          : "Failed to read the selected Excel workbook.",
      );
    }
  }

  function handleSheetChange(sheet: string) {
    if (!workbook) {
      return;
    }

    setSheetName(sheet);
    setHeaderRow(1);
    parseSelectedWorksheet(workbook, sheet, 1);
  }

  function handleHeaderRowChange(row: number) {
    if (!workbook || !sheetName) {
      return;
    }

    setHeaderRow(row);
    parseSelectedWorksheet(workbook, sheetName, row);
  }

  async function handleImport() {
    if (bulkInsert.isPending) {
      return;
    }

    setImportError(null);

    const validation = validateImportRows(rows, mapping, columns, headerRow);

    if (!validation.isValid) {
      setImportError(validation.message);
      return;
    }

    const records = buildInventoryRecords(
      validation.rows,
      mapping,
      accountId,
      inventoryType,
      columns,
    );

    if (records.length === 0) {
      setImportError("There are no valid mapped records to import.");
      return;
    }

    try {
      await bulkInsert.mutateAsync(records);

      reset();
      onClose();
    } catch (error) {
      console.error("Failed importing inventory records", error);

      setImportError(
        error instanceof Error
          ? error.message
          : "Failed to import inventory records.",
      );
    }
  }

  function handleClose() {
    if (bulkInsert.isPending) {
      return;
    }

    reset();
    onClose();
  }

  return {
    file,
    workbook,
    sheetName,
    headerRow,
    rows,
    excelColumns,
    mapping,
    importError,

    setRows,
    setMapping,

    handleFile,
    handleSheetChange,
    handleHeaderRowChange,
    handleImport,
    handleClose,

    bulkInsert,
  };
}
