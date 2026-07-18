import { useState } from "react";

import type { AccountColumn } from "@/features/inventory/account-columns";

import {
  type ColumnMapping,
  type ExcelWorkbook,
  type Group,
  type InventoryType,
  type PreviewRow,
} from "../types";

import { readWorkbook } from "../utils/readWorkbook";
import { parseWorksheet } from "../utils/parseWorksheet";
import { createAutoMapping } from "../utils/createAutoMapping";
import { buildInventoryRecords } from "../utils/buildInventoryRecords";
import { useBulkInsertInventoryRecords } from "./useInventoryRecords";

type Params = {
  accountId: number;
  inventoryType: InventoryType;
  columns: AccountColumn[];
  groups: Group[];
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

  const bulkInsert = useBulkInsertInventoryRecords();

  function reset() {
    setFile(null);
    setWorkbook(null);
    setSheetName("");
    setRows([]);
    setExcelColumns([]);
    setMapping({});
  }

  function createPreviewRows(parsed: Record<string, unknown>[]) {
    const preview: PreviewRow[] = parsed.map((row) => ({
      id: crypto.randomUUID(),
      selected: false,
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

  async function handleFile(file: File) {
    setFile(file);

    const wb = await readWorkbook(file);

    setWorkbook(wb);

    if (!wb.SheetNames.length) return;

    const firstSheet = wb.SheetNames[0];

    setSheetName(firstSheet);

    const parsed = parseWorksheet(wb, firstSheet);

    createPreviewRows(parsed);

    setMapping(createAutoMapping(Object.keys(parsed[0] ?? {}), columns));
  }

  function handleSheetChange(sheet: string) {
    if (!workbook) return;

    setSheetName(sheet);

    const parsed = parseWorksheet(workbook, sheet);

    createPreviewRows(parsed);

    setMapping(createAutoMapping(Object.keys(parsed[0] ?? {}), columns));
  }

  async function handleImport() {
    const validRows = rows.filter((row) =>
      Object.values(row.data).some((v) => v != null && String(v).trim() !== ""),
    );

    const records = buildInventoryRecords(
      validRows,
      mapping,
      accountId,
      inventoryType,
      columns,
    );

    if (!records.length) {
      alert("Nothing to import.");
      return;
    }

    await bulkInsert.mutateAsync(records);

    reset();
    onClose();
  }

  function handleClose() {
    reset();
    onClose();
  }

  return {
    file,
    workbook,
    sheetName,
    rows,
    excelColumns,
    mapping,

    setRows,
    setMapping,

    handleFile,
    handleSheetChange,
    handleImport,
    handleClose,

    bulkInsert,
  };
}
