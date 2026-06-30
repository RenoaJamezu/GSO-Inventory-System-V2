import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import AccountColumnDialog from "../components/AccountColumnDialog";
import AccountColumnsTable from "../components/AccountColumnsTable";
import {
  useAccountColumns,
  useDeleteAccountColumn,
} from "../hooks/useAccountColumns";
import type { AccountColumn } from "../types";

import { useInventoryAccount } from "@/features/inventory-accounts/hooks/useInventoryAccounts";
import { ConfirmDialog } from "@/components/dialog";

export default function AccountColumnsPage() {
  const { accountId } = useParams();

  const deleteMutation = useDeleteAccountColumn();

  const [deleteColumn, setDeleteColumn] = useState<AccountColumn | null>(null);

  const id = Number(accountId);

  const { data: account, isLoading: accountLoading } = useInventoryAccount(id);

  const { data: columns = [], isLoading: columnsLoading } =
    useAccountColumns(id);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedColumn, setSelectedColumn] = useState<AccountColumn | null>(
    null,
  );

  const openCreate = () => {
    setSelectedColumn(null);
    setDialogOpen(true);
  };

  const openEdit = (column: AccountColumn) => {
    setSelectedColumn(column);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedColumn(null);
  };

  const openDelete = (column: AccountColumn) => {
    setDeleteColumn(column);
  };

  const closeDelete = () => {
    setDeleteColumn(null);
  };

  const confirmDelete = async () => {
    if (!deleteColumn) return;

    await deleteMutation.mutateAsync(deleteColumn.id);

    closeDelete();
  };

  if (accountLoading || columnsLoading) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <Link to="/inventory-accounts" className="text-blue-600 hover:underline">
        ← Back
      </Link>

      <div className="mb-6 mt-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{account?.account_title}</h1>

          <p className="text-gray-500">Configure dynamic columns</p>
        </div>

        <button
          onClick={openCreate}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Add Column
        </button>
      </div>

      <AccountColumnsTable
        columns={columns}
        onEdit={openEdit}
        onDelete={openDelete}
      />

      <AccountColumnDialog
        open={dialogOpen}
        accountId={id}
        column={selectedColumn}
        onClose={closeDialog}
      />

      <ConfirmDialog
        open={!!deleteColumn}
        title="Delete Column"
        description={`Delete "${deleteColumn?.label}"?`}
        loading={deleteMutation.isPending}
        onCancel={closeDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
