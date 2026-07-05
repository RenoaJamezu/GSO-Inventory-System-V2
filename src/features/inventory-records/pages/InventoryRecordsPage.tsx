import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { InventoryRecord } from "../types";
import { useInventoryAccount } from "@/features/inventory-accounts";
import {
  useBulkAssignGroup,
  useBulkDeleteInventoryRecords,
  useInventoryRecords,
} from "../hooks/useInventoryRecords";
import { GroupManagementDialog, useGroups } from "@/features/groups";
import { useAccountColumns } from "@/features/account-columns";
import { generateTemplate } from "../utils/generateTemplate";
import InventoryRecordsTable from "../components/InventoryRecordsTable";
import InventoryRecordDialog from "../components/InventoryRecordDialog";
import { ExcelImportDialog } from "@/features/excel-import";
import { ConfirmDialog } from "@/components/dialog";
import InventoryHeader from "../components/InventoryHeader";
import InventoryBulkToolbar from "../components/InventoryBulkToolbar";

export default function InventoryRecordsPage() {
  const { accountId } = useParams();

  const id = Number(accountId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<InventoryRecord | null>(
    null,
  );

  const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);

  const [selectedGroupId, setSelectedGroupId] = useState("");

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [importOpen, setImportOpen] = useState(false);

  const { data: account, isLoading: accountLoading } = useInventoryAccount(id);

  const { data: records = [], isLoading: recordsLoading } =
    useInventoryRecords(id);

  const { data: groups = [], isLoading: groupsLoading } = useGroups(id);

  const { data: columns = [], isLoading: columnsLoading } =
    useAccountColumns(id);

  const bulkDeleteMutation = useBulkDeleteInventoryRecords();

  const bulkAssignMutation = useBulkAssignGroup();

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
    generateTemplate(columns, account);
  };

  const handleOpenImport = () => {
    setImportOpen(true);
  };

  const handleCloseImport = () => {
    setImportOpen(false);
  };

  function handleOpenBulkDelete() {
    if (!selectedIds.length) return;

    setDeleteSelectedOpen(true);
  }

  function handleCloseBulkDelete() {
    setDeleteSelectedOpen(false);
  }

  async function handleConfirmBulkDelete() {
    try {
      await bulkDeleteMutation.mutateAsync(selectedIds);

      setSelectedIds([]);

      setDeleteSelectedOpen(false);
    } catch (error) {
      console.error(error);

      alert("Failed to delete records.");
    }
  }

  async function handleBulkAssignGroup() {
    if (!selectedIds.length || !selectedGroupId) return;

    try {
      await bulkAssignMutation.mutateAsync({
        ids: selectedIds,
        groupId: Number(selectedGroupId),
      });

      setSelectedIds([]);
      setSelectedGroupId("");

      alert("Group assigned successfully.");
    } catch (error) {
      console.error(error);

      alert("Failed to assign group.");
    }
  }

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

        <InventoryHeader
          account={account!}
          onAdd={handleCreate}
          onImport={handleOpenImport}
          onDownloadTemplate={handleDownloadTemplate}
          onManageGroups={handleOpenGroups}
        />

        <InventoryBulkToolbar
          selectedIds={selectedIds}
          groups={groups}
          selectedGroupId={selectedGroupId}
          setSelectedGroupId={setSelectedGroupId}
          onApplyGroup={handleBulkAssignGroup}
          onDelete={handleOpenBulkDelete}
          onPrint={() =>
            window.open(`/bulk-print?ids=${selectedIds.join(",")}`, "_blank")
          }
        />

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

      <ConfirmDialog
        open={deleteSelectedOpen}
        title="Delete Selected Records"
        description={`Delete ${selectedIds.length} selected record${
          selectedIds.length === 1 ? "" : "s"
        }? This action cannot be undone.`}
        loading={bulkDeleteMutation.isPending}
        onCancel={handleCloseBulkDelete}
        onConfirm={handleConfirmBulkDelete}
      />
    </>
  );
}
