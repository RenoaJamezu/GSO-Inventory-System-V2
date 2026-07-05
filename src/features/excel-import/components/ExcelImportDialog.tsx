import * as XLSX from "xlsx";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@/components/dialog";
import type { AccountColumn } from "@/features/account-columns";
import type { Group } from "@/features/groups";
import {
  type PreviewRow,
  useBulkInsertInventoryRecords,
} from "@/features/inventory-records";
import { useState } from "react";
import { buildInventoryRecords } from "../utils/buildInventoryRecords";
import { createAutoMapping } from "../utils/createAutoMapping";
import { parseWorksheet } from "../utils/parseWorksheet";
import { readWorkbook } from "../utils/readWorkbook";
import ColumnMapper from "./ColumnMapper";
import ExcelDropzone from "./ExcelDropzone";
import ExcelPreviewTable from "./ExcelPreviewTable";
import SheetSelector from "./SheetSelector";

type Props = {
  open: boolean;
  accountId: number;
  columns: AccountColumn[];
  groups: Group[];
  onClose: () => void;
};

export default function ExcelImportDialog({
  open,
  accountId,
  columns,
  groups,
  onClose,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheetName, setSheetName] = useState("");

  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [excelColumns, setExcelColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const bulkInsert = useBulkInsertInventoryRecords();

  function createPreviewRows(parsed: Record<string, unknown>[]) {
    const preview: PreviewRow[] = parsed.map((row) => ({
      id: crypto.randomUUID(),
      selected: true,
      group_id: null,
      data: row,
    }));

    setRows(preview);

    if (parsed.length > 0) {
      setExcelColumns(Object.keys(parsed[0]));
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

    const autoMapping = createAutoMapping(
      Object.keys(parsed[0] ?? {}),
      columns,
    );

    setMapping(autoMapping);
  }

  function handleSheetChange(name: string) {
    if (!workbook) return;

    setSheetName(name);

    const parsed = parseWorksheet(workbook, name);

    createPreviewRows(parsed);

    const autoMapping = createAutoMapping(
      Object.keys(parsed[0] ?? {}),
      columns,
    );

    setMapping(autoMapping);
  }

  async function handleImport() {
    const validRows = rows.filter((row) =>
      Object.values(row.data).some(
        (value) =>
          value !== null && value !== undefined && String(value).trim() !== "",
      ),
    );
    
    const records = buildInventoryRecords(
      validRows,
      mapping,
      accountId,
      columns,
    );

    if (!records.length) {
      alert("Nothing to import.");
      return;
    }

    try {
      await bulkInsert.mutateAsync(records);
      handleClose();
    } catch (err) {
      console.error(err);
      alert("Import failed.");
    }
  }

  function handleClose() {
    setFile(null);
    setWorkbook(null);
    setSheetName("");
    setRows([]);
    setMapping({});
    setExcelColumns([]);

    onClose();
  }

  if (!open) return null;

  return (
    <Dialog open={open} maxWidth="xl">
      <DialogHeader title="Import Excel Records" />

      <DialogBody>
        <div className="space-y-6">
          {/* Upload */}
          <ExcelDropzone file={file} onFileSelect={handleFile} />

          {/* Sheet */}
          <SheetSelector
            workbook={workbook}
            value={sheetName}
            onChange={handleSheetChange}
          />

          {/* Column Mapping */}
          {excelColumns.length > 0 && (
            <ColumnMapper
              excelColumns={excelColumns}
              systemColumns={columns}
              mapping={mapping}
              setMapping={setMapping}
            />
          )}

          {/* Preview */}
          {rows.length > 0 && (
            <ExcelPreviewTable
              rows={rows}
              setRows={setRows}
              columns={columns}
              groups={groups}
              mapping={mapping}
            />
          )}
        </div>
      </DialogBody>

      <DialogFooter>
        <button
          type="button"
          onClick={handleClose}
          className="rounded border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={handleImport}
          disabled={bulkInsert.isPending || rows.length === 0}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {bulkInsert.isPending
            ? "Importing..."
            : `Import ${rows.length} Records`}
        </button>
      </DialogFooter>
    </Dialog>
  );
}
