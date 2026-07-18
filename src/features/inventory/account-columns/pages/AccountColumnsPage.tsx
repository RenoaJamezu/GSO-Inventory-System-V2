import { ConfirmDialog } from "@/components/dialog";
import { Button } from "@/components/ui";
import { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useInventoryAccount } from "../../inventory-accounts";
import AccountColumnDialog from "../components/AccountColumnDialog";
import AccountColumnsTable from "../components/AccountColumnsTable";
import {
  useDeleteAccountColumn,
  useAccountColumns,
} from "../hooks/useAccountColumns";
import type { AccountColumn } from "../types";

export default function AccountColumnsPage() {
  const { accountId } = useParams();

  const id = Number(accountId);

  const { pathname } = useLocation();

  const workspace = pathname.startsWith("/par")
    ? {
        title: "PAR Inventory",
        backLink: `/par`,
      }
    : pathname.startsWith("/high-cost")
      ? {
          title: "ICS - High Cost",
          backLink: `/high-cost`,
        }
      : {
          title: "ICS - Low Cost",
          backLink: `/low-cost`,
        };

  const deleteMutation = useDeleteAccountColumn();

  const { data: account, isLoading: accountLoading } = useInventoryAccount(id);

  const { data: columns = [], isLoading: columnsLoading } =
    useAccountColumns(id);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedColumn, setSelectedColumn] = useState<AccountColumn | null>(
    null,
  );

  const [deleteColumn, setDeleteColumn] = useState<AccountColumn | null>(null);

  function openCreate() {
    setSelectedColumn(null);
    setDialogOpen(true);
  }

  function openEdit(column: AccountColumn) {
    setSelectedColumn(column);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setSelectedColumn(null);
  }

  function openDelete(column: AccountColumn) {
    setDeleteColumn(column);
  }

  function closeDelete() {
    setDeleteColumn(null);
  }

  async function confirmDelete() {
    if (!deleteColumn) return;

    await deleteMutation.mutateAsync({
      id: deleteColumn.id,
      account_id: deleteColumn.account_id,
    });

    closeDelete();
  }

  if (accountLoading || columnsLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <p className="text-sm text-gray-500">Loading account columns...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumb */}

      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/home" className="transition hover:text-emerald-600">
          Home
        </Link>

        <span>/</span>

        <Link
          to={workspace.backLink}
          className="transition hover:text-emerald-600 capitalize"
        >
          {workspace.title}
        </Link>

        <span>/</span>

        <Link
          to={`${workspace.backLink}/${id}/records`}
          className="transition hover:text-emerald-600 capitalize"
        >
          {account?.account_title}
        </Link>

        <span>/</span>

        <span className="font-medium text-gray-900">Columns</span>
      </nav>

      {/* Header */}

      <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Column Configuration
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-gray-500">
            Configure the fields that will appear on every inventory record
            under{" "}
            <span className="font-semibold text-gray-700">
              {account?.account_title}
            </span>
            .
          </p>
        </div>

        <Button onClick={openCreate}>+ New Column</Button>
      </div>

      {/* Table Card */}

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-300 px-6 py-4">
          <h2 className="text-lg font-semibold">Configured Columns</h2>

          <p className="mt-1 text-sm text-gray-500">
            These fields will be displayed when creating or editing inventory
            records.
          </p>
        </div>

        <div className="p-6">
          <AccountColumnsTable
            columns={columns}
            onEdit={openEdit}
            onDelete={openDelete}
          />
        </div>
      </section>

      <AccountColumnDialog
        open={dialogOpen}
        accountId={id}
        column={selectedColumn}
        onClose={closeDialog}
      />

      <ConfirmDialog
        open={!!deleteColumn}
        title="Delete Column"
        description={`Are you sure you want to delete "${deleteColumn?.label}"?\n\nExisting inventory records will retain their data, but this column will no longer be available when creating or editing records.`}
        loading={deleteMutation.isPending}
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
