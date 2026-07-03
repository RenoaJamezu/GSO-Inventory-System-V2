import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useInventoryAccount } from "@/features/inventory-accounts";
import { useAccountColumns } from "@/features/account-columns";

import InventoryRecordDialog from "../components/InventoryRecordDialog";
import InventoryRecordsTable from "../components/InventoryRecordsTable";

import { useInventoryRecords } from "../hooks/useInventoryRecords";

import type { InventoryRecord } from "../types";
import { useGroups } from "@/features/groups";
import GroupManagementDialog from "@/features/groups/components/GroupManagementDialog";

export default function InventoryRecordsPage() {
  const { accountId } = useParams();

  const id = Number(accountId);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [groupDialogOpen, setGroupDialogOpen] = useState(false);

  const [selectedRecord, setSelectedRecord] = useState<InventoryRecord | null>(
    null,
  );

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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
              onClick={handleOpenGroups}
              className="rounded border px-4 py-2"
            >
              Manage Groups
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

      <GroupManagementDialog
        open={groupDialogOpen}
        accountId={id}
        onClose={handleCloseGroups}
      />
    </>
  );
}
