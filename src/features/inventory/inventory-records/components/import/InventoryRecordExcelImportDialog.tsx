import type { AccountColumn } from "@/features/inventory/account-columns";

import type { Group, InventoryType } from "../../types";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { Button } from "@/components/ui";

import InventoryRecordExcelDropzone from "./InventoryRecordExcelDropzone";
import InventoryRecordSheetSelector from "./InventoryRecordSheetSelector";
import InventoryRecordColumnMapper from "./InventoryRecordColumnMapper";
import InventoryRecordExcelPreviewTable from "./InventoryRecordExcelPreviewTable";

import { useInventoryRecordImport } from "../../hooks/useInventoryRecordImport";
import InventoryRecordHeaderRowSelector from "./InventoryRecordHeaderRowSelector";

type Props = {
  open: boolean;
  accountId: number;
  inventoryType: InventoryType;
  columns: AccountColumn[];
  groups: Group[];
  onClose: () => void;
};

export default function InventoryRecordExcelImportDialog({
  open,
  accountId,
  inventoryType,
  columns,
  groups,
  onClose,
}: Props) {
  const {
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
  } = useInventoryRecordImport({
    accountId,
    inventoryType,
    columns,
    onClose,
  });

  if (!open) return null;

  const loading = bulkInsert.isPending;

  return (
    <Dialog
      open={open}
      maxWidth="xl"
      onClose={loading ? undefined : handleClose}
    >
      <DialogHeader title="Import Excel Records">
        <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
          Upload an Excel file, map its columns, review the records, then import
          them into this inventory account.
        </p>
      </DialogHeader>

      <DialogBody>
        <div className="space-y-6">
          {importError && (
            <div
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
            >
              {importError}
            </div>
          )}
          <section className="space-y-3">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                1. Upload File
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Select the Excel workbook containing the inventory records.
              </p>
            </div>

            <InventoryRecordExcelDropzone
              file={file}
              onFileSelect={handleFile}
            />
          </section>

          {workbook && (
            <section className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  2. Select Worksheet
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Choose the worksheet that contains the records you want to
                  import.
                </p>
              </div>

              <InventoryRecordSheetSelector
                workbook={workbook}
                value={sheetName}
                onChange={handleSheetChange}
              />
            </section>
          )}

          {workbook && sheetName && (
            <section className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  3. Select Header Row
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter the Excel row containing the inventory column names.
                  Rows above it will be ignored.
                </p>
              </div>

              <InventoryRecordHeaderRowSelector
                value={headerRow}
                onChange={handleHeaderRowChange}
              />
            </section>
          )}

          {excelColumns.length > 0 && (
            <section className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  4. Map Columns
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Match each Excel column with a configured inventory field.
                </p>
              </div>

              <InventoryRecordColumnMapper
                excelColumns={excelColumns}
                systemColumns={columns}
                mapping={mapping}
                setMapping={setMapping}
              />
            </section>
          )}

          {rows.length > 0 && (
            <section className="space-y-3 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  5. Review Records
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Review the parsed records before importing them.
                </p>
              </div>

              <InventoryRecordExcelPreviewTable
                rows={rows}
                setRows={setRows}
                columns={columns}
                groups={groups}
                mapping={mapping}
              />
            </section>
          )}
        </div>
      </DialogBody>

      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          onClick={handleClose}
          disabled={loading}
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={handleImport}
          loading={loading}
          disabled={loading || rows.length === 0}
        >
          Import {rows.length} {rows.length === 1 ? "Record" : "Records"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
