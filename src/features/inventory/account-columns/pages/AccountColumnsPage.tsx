import { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { ChevronRight, Plus } from "lucide-react";

import { ConfirmDialog } from "@/components/dialog";
import { Button, PageHeader } from "@/components/ui";

import { useInventoryAccount } from "../../inventory-accounts";

import AccountColumnDialog from "../components/AccountColumnDialog";
import AccountColumnsTable from "../components/AccountColumnsTable";

import {
  useAccountColumns,
  useDeleteAccountColumn,
} from "../hooks/useAccountColumns";

import type { AccountColumn } from "../types";

export default function AccountColumnsPage() {
  const { accountId } = useParams();

  const id = Number(accountId);

  const { pathname } = useLocation();

  const workspace = pathname.startsWith("/par")
    ? {
        title: "PAR Inventory",
        backLink: "/par",
      }
    : pathname.startsWith("/high-cost")
      ? {
          title: "ICS - High Cost",
          backLink: "/high-cost",
        }
      : {
          title: "ICS - Low Cost",
          backLink: "/low-cost",
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
    if (deleteMutation.isPending) {
      return;
    }

    setDeleteColumn(null);
  }

  async function confirmDelete() {
    if (!deleteColumn) return;

    await deleteMutation.mutateAsync({
      id: deleteColumn.id,
      account_id: deleteColumn.account_id,
    });

    setDeleteColumn(null);
  }

  if (accountLoading || columnsLoading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading account columns...
      </div>
    );
  }

  const accountTitle = account?.account_title ?? "Inventory Account";

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-1.5 text-sm"
      >
        <Link
          to="/dashboard"
          className="
            text-slate-500
            transition-colors
            hover:text-emerald-700
            dark:text-slate-400
            dark:hover:text-emerald-400
          "
        >
          Dashboard
        </Link>

        <ChevronRight
          size={15}
          className="text-slate-400 dark:text-slate-600"
        />

        <Link
          to={workspace.backLink}
          className="
            text-slate-500
            transition-colors
            hover:text-emerald-700
            dark:text-slate-400
            dark:hover:text-emerald-400
          "
        >
          {workspace.title}
        </Link>

        <ChevronRight
          size={15}
          className="text-slate-400 dark:text-slate-600"
        />

        <Link
          to={`${workspace.backLink}/${id}/records`}
          className="
            max-w-64 truncate
            text-slate-500
            transition-colors
            hover:text-emerald-700
            dark:text-slate-400
            dark:hover:text-emerald-400
          "
        >
          {accountTitle}
        </Link>

        <ChevronRight
          size={15}
          className="text-slate-400 dark:text-slate-600"
        />

        <span className="font-medium text-slate-700 dark:text-slate-200">
          Columns
        </span>
      </nav>

      <PageHeader
        title="Column Configuration"
        description={`Configure the fields used by inventory records under ${accountTitle}.`}
        actions={
          <Button onClick={openCreate} className="flex items-center gap-2">
            <Plus size={17} />
            Add Column
          </Button>
        }
      />

      <section
        className="
          overflow-hidden
          rounded-lg border
          border-slate-200
          bg-white

          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        <div
          className="
            border-b border-slate-200
            px-5 py-4
            dark:border-slate-800
          "
        >
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Configured Columns
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            These fields appear when creating, editing, viewing, importing, and
            exporting inventory records.
          </p>
        </div>

        <AccountColumnsTable
          columns={columns}
          onEdit={openEdit}
          onDelete={openDelete}
        />
      </section>

      <AccountColumnDialog
        open={dialogOpen}
        accountId={id}
        column={selectedColumn}
        onClose={closeDialog}
      />

      <ConfirmDialog
        open={Boolean(deleteColumn)}
        title="Delete Column"
        description={`Are you sure you want to delete "${deleteColumn?.label ?? ""}"?\n\nExisting inventory records will retain their stored data, but this field will no longer be available when creating or editing records.`}
        confirmText="Delete Column"
        loading={deleteMutation.isPending}
        loadingText="Deleting..."
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
