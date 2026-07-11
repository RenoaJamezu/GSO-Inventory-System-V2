import type { AccountColumn } from "@/features/account-columns";
import type { Group } from "../../types";
import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";
import InventoryRecordExcelDropzone from "./InventoryRecordExcelDropzone";
import InventoryRecordSheetSelector from "./InventoryRecordSheetSelector";
import InventoryRecordColumnMapper from "./InventoryRecordColumnMapper";
import InventoryRecordExcelPreviewTable from "./InventoryRecordExcelPreviewTable";
import { useInventoryRecordImport } from "../../hooks/useInventoryRecordImport";

type Props = {
  open: boolean;
  accountId: number;
  columns: AccountColumn[];
  groups: Group[];
  onClose: () => void;
};

export default function InventoryRecordExcelImportDialog({
  open,
  accountId,
  columns,
  groups,
  onClose,
}: Props) {
  const {
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
  } = useInventoryRecordImport({
    accountId,
    columns,
    groups,
    onClose,
  });

  if (!open) return null;

  return (
    <Dialog open={open} maxWidth="xl">
      <DialogHeader title="Import Excel Records" />

      <DialogBody>
        <div className="space-y-6">
          {/* Upload */}
          <InventoryRecordExcelDropzone file={file} onFileSelect={handleFile} />

          {/* Sheet */}
          <InventoryRecordSheetSelector
            workbook={workbook}
            value={sheetName}
            onChange={handleSheetChange}
          />

          {/* Column Mapping */}
          {excelColumns.length > 0 && (
            <InventoryRecordColumnMapper
              excelColumns={excelColumns}
              systemColumns={columns}
              mapping={mapping}
              setMapping={setMapping}
            />
          )}

          {/* Preview */}
          {rows.length > 0 && (
            <InventoryRecordExcelPreviewTable
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
