import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { InventoryRecord } from "../types";
import { useInventoryAccount } from "@/features/inventory-accounts";
import { useInventoryRecords } from "../hooks/useInventoryRecords";
import { GroupManagementDialog, useGroups } from "@/features/groups";
import { useAccountColumns } from "@/features/account-columns";
import { generateTemplate } from "../utils/generateTemplate";
import InventoryRecordsTable from "../components/InventoryRecordsTable";
import InventoryRecordDialog from "../components/InventoryRecordDialog";
import { ExcelImportDialog } from "@/features/excel-import";

export default function InventoryRecordsPage() {
  const navigate = useNavigate();
  const { accountId } = useParams();

  const id = Number(accountId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<InventoryRecord | null>(
    null,
  );

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [importOpen, setImportOpen] = useState(false);

  const { data: account, isLoading: accountLoading } = useInventoryAccount(id);

  const { data: records = [], isLoading: recordsLoading } =
    useInventoryRecords(id);

  const { data: groups = [], isLoading: groupsLoading } = useGroups(id);

  const { data: columns = [], isLoading: columnsLoading } =
    useAccountColumns(id);

  const handleCreate = () => {
    setSelectedRecord(null);
    setDialogOpen(true);
  };

  const handleEdit = (record: InventoryRecord) => {
    setSelectedRecord(record);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setSelectedRecord(null);
  };

  const handleOpenGroups = () => {
    setGroupDialogOpen(true);
  };

  const handleCloseGroups = () => {
    setGroupDialogOpen(false);
  };

  const handleDownloadTemplate = () => {
    generateTemplate(columns);
  };

  const handleOpenImport = () => {
    setImportOpen(true);
  };

  const handleCloseImport = () => {
    setImportOpen(false);
  };

  if (accountLoading || recordsLoading || columnsLoading || groupsLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <>
      <div className="mx-auto max-w-7xl p-6">
        <Link
          to="/inventory-accounts"
          className="text-blue-600 hover:underline"
        >
          ← Back
        </Link>

        <div className="mb-6 mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold capitalize">
              {account?.account_title}
            </h1>

            <p className="text-gray-500">Inventory Records</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleDownloadTemplate}
              className="rounded bg-green-600 px-4 py-2 text-white"
            >
              Download Template
            </button>

            <button
              onClick={handleOpenImport}
              className="rounded bg-purple-600 px-4 py-2 text-white"
            >
              Import Excel
            </button>
            <button
              onClick={handleOpenGroups}
              className="rounded border px-4 py-2"
            >
              Manage Groups
            </button>

            <button
              onClick={() =>
                navigate(`/inventory-accounts/${account.id}/columns`)
              }
              className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
            >
              Manage Columns
            </button>

            <button
              onClick={() => {
                if (!selectedIds.length) return;

                window.open(
                  `/bulk-print?ids=${selectedIds.join(",")}`,
                  "_blank",
                );
              }}
              disabled={!selectedIds.length}
              className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Print Selected ({selectedIds.length})
            </button>

            <button
              onClick={handleCreate}
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Add Record
            </button>
          </div>
        </div>

        <InventoryRecordsTable
          columns={columns}
          records={records}
          groups={groups}
          selectedIds={selectedIds}
          onSelectionChange={setSelectedIds}
          onEdit={handleEdit}
        />
      </div>

      <InventoryRecordDialog
        open={dialogOpen}
        accountId={id}
        record={selectedRecord}
        onClose={handleClose}
      />

      <ExcelImportDialog
        open={importOpen}
        accountId={id}
        groups={groups}
        columns={columns}
        onClose={handleCloseImport}
      />

      <GroupManagementDialog
        open={groupDialogOpen}
        accountId={id}
        onClose={handleCloseGroups}
      />
    </>
  );
}
