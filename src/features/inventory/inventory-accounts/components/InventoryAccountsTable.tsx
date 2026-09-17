import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ConfirmDialog } from "@/components/dialog";
import { PERMISSIONS, usePermissions } from "@/features/auth";

import {
  useDeleteInventoryAccount,
  useReorderInventoryAccounts,
} from "../hooks/useInventoryAccounts";
import type { InventoryAccount } from "../types";

import SortableInventoryAccountRow from "./SortableInventoryAccountRow";

interface InventoryAccountsTableProps {
  accounts: InventoryAccount[];
  workspaceRoute: string;
  isFiltered: boolean;
  onEdit: (account: InventoryAccount) => void;
}

export default function InventoryAccountsTable({
  accounts,
  workspaceRoute,
  isFiltered,
  onEdit,
}: InventoryAccountsTableProps) {
  const navigate = useNavigate();

  const { can } = usePermissions();

  const canManageAccounts = can(PERMISSIONS.INVENTORY_MANAGE_ACCOUNTS);
  const canReorder = canManageAccounts && !isFiltered;

  const deleteMutation = useDeleteInventoryAccount();
  const reorderMutation = useReorderInventoryAccounts();

  const [accountToDelete, setAccountToDelete] =
    useState<InventoryAccount | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function openAccount(accountId: number) {
    navigate(`/${workspaceRoute}/${accountId}/records`);
  }

  function requestDelete(account: InventoryAccount) {
    setAccountToDelete(account);
  }

  function closeDeleteDialog() {
    if (deleteMutation.isPending) {
      return;
    }

    setAccountToDelete(null);
  }

  async function confirmDelete() {
    if (!canManageAccounts || !accountToDelete) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(accountToDelete.id);
      setAccountToDelete(null);
    } catch (error) {
      console.error("Failed deleting inventory account", error);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (
      !canReorder ||
      reorderMutation.isPending ||
      !over ||
      active.id === over.id
    ) {
      return;
    }

    const oldIndex = accounts.findIndex((account) => account.id === active.id);
    const newIndex = accounts.findIndex((account) => account.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedAccounts = arrayMove(accounts, oldIndex, newIndex);

    const availableSortOrders = accounts
      .map((account) => account.sort_order)
      .sort((firstOrder, secondOrder) => firstOrder - secondOrder);

    reorderMutation.mutate({
      accounts: reorderedAccounts.map((account, index) => ({
        id: account.id,
        sort_order: availableSortOrders[index] ?? index,
      })),
    });
  }

  const columnCount = canManageAccounts ? 7 : 5;

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={accounts.map((account) => account.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr
                  className="
                    border-b border-slate-200
                    bg-slate-50
                    text-xs font-semibold uppercase
                    tracking-wide text-slate-500
                    dark:border-slate-800
                    dark:bg-slate-800/40
                    dark:text-slate-400
                  "
                >
                  {canManageAccounts && (
                    <th className="w-12 px-2 py-3">
                      <span className="sr-only">Reorder</span>
                    </th>
                  )}

                  <th className="w-20 px-4 py-3 text-center">No.</th>
                  <th className="px-4 py-3 text-left">Account Title</th>

                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    Book Value
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    Per Inventory Report
                  </th>

                  <th className="whitespace-nowrap px-4 py-3 text-right">
                    Variance
                  </th>

                  {canManageAccounts && (
                    <th className="w-16 px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {accounts.length === 0 ? (
                  <tr>
                    <td
                      colSpan={columnCount}
                      className="px-6 py-14 text-center text-sm text-slate-500 dark:text-slate-400"
                    >
                      No inventory accounts found.
                    </td>
                  </tr>
                ) : (
                  accounts.map((account, index) => (
                    <SortableInventoryAccountRow
                      key={account.id}
                      account={account}
                      index={index}
                      canManageAccounts={canManageAccounts}
                      canReorder={canReorder}
                      isReordering={reorderMutation.isPending}
                      onOpen={openAccount}
                      onEdit={onEdit}
                      onDelete={requestDelete}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SortableContext>
      </DndContext>

      {canManageAccounts && (
        <ConfirmDialog
          open={Boolean(accountToDelete)}
          title="Delete Account"
          description={`Are you sure you want to delete "${accountToDelete?.account_title ?? ""}"?\n\nThis account will be removed from the inventory workspace.`}
          confirmText="Delete Account"
          loading={deleteMutation.isPending}
          loadingText="Deleting..."
          onClose={closeDeleteDialog}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}
