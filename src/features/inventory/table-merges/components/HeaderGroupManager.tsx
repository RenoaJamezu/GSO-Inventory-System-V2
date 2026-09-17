import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { ConfirmDialog } from "@/components/dialog";
import { Button } from "@/components/ui";

import type { InventoryTableColumn } from "../../inventory-records/table-layout";
import {
  useAccountColumnGroups,
  useDeleteAccountColumnGroup,
} from "../hooks/useTableMerges";
import type { AccountColumnGroup } from "../types";

import HeaderGroupDialog from "./HeaderGroupDialog";

interface Props {
  accountId: number;
  columns: InventoryTableColumn[];
}

export default function HeaderGroupManager({ accountId, columns }: Props) {
  const groupsQuery = useAccountColumnGroups(accountId);
  const deleteGroup = useDeleteAccountColumnGroup();

  const groups = groupsQuery.data ?? [];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<AccountColumnGroup | null>(
    null,
  );
  const [deleteTarget, setDeleteTarget] = useState<AccountColumnGroup | null>(
    null,
  );

  function handleCreate() {
    setEditingGroup(null);
    setDialogOpen(true);
  }

  function handleEdit(group: AccountColumnGroup) {
    setEditingGroup(group);
    setDialogOpen(true);
  }

  function handleClose() {
    setDialogOpen(false);
    setEditingGroup(null);
  }

  function handleDelete(group: AccountColumnGroup) {
    setDeleteTarget(group);
  }

  function handleDeleteClose() {
    if (deleteGroup.isPending) {
      return;
    }

    setDeleteTarget(null);
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) {
      return;
    }

    try {
      await deleteGroup.mutateAsync({
        id: deleteTarget.id,
        account_id: accountId,
      });

      setDeleteTarget(null);
    } catch (error) {
      console.error("Failed deleting header group", error);
    }
  }

  return (
    <>
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Header Groups
            </h3>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Combine consecutive columns under a shared table header.
            </p>
          </div>

          <Button
            type="button"
            size="sm"
            onClick={handleCreate}
            disabled={columns.length < 2}
          >
            <Plus size={16} />
            Add Header Group
          </Button>
        </div>

        {groupsQuery.isLoading ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading header groups...
          </p>
        ) : groupsQuery.isError ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            Error loading header groups.
          </p>
        ) : groups.length ? (
          <div className="divide-y divide-slate-200 rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
            {groups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between gap-4 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                    {group.label}
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Column IDs {group.start_column_id}–{group.end_column_id}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(group)}
                    disabled={deleteGroup.isPending}
                    aria-label={`Edit ${group.label}`}
                  >
                    <Pencil size={15} />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(group)}
                    disabled={deleteGroup.isPending}
                    aria-label={`Delete ${group.label}`}
                  >
                    <Trash2 size={15} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 px-4 py-6 text-center dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No header groups configured.
            </p>
          </div>
        )}
      </section>

      {dialogOpen && (
        <HeaderGroupDialog
          key={editingGroup?.id ?? "create"}
          open
          onClose={handleClose}
          accountId={accountId}
          columns={columns}
          groups={groups}
          editingGroup={editingGroup}
        />
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete Header Group"
        description={`Are you sure you want to delete "${deleteTarget?.label ?? ""}"? The inventory columns themselves will not be deleted.`}
        confirmText="Delete Group"
        loading={deleteGroup.isPending}
        loadingText="Deleting..."
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
