import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Ellipsis, Pencil, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/dialog";
import { Button } from "@/components/ui";

import { Dropdown, DropdownItem } from "@/components/ui/dropdown";

import { formatCurrency, formatNumber } from "@/lib/utils/format";

import { useDeleteInventoryAccount } from "../hooks/useInventoryAccounts";

import type { InventoryAccount } from "../types";
import { PERMISSIONS, usePermissions } from "@/features/auth";

type InventoryAccountsTableProps = {
  accounts: InventoryAccount[];
  workspace: "PAR" | "HIGH_COST" | "LOW_COST";
  onEdit: (account: InventoryAccount) => void;
};

export default function InventoryAccountsTable({
  accounts,
  workspace,
  onEdit,
}: InventoryAccountsTableProps) {
  const navigate = useNavigate();

  const { can } = usePermissions();

  const canManageAccounts = can(PERMISSIONS.INVENTORY_MANAGE_ACCOUNTS);

  const deleteMutation = useDeleteInventoryAccount();

  const [accountToDelete, setAccountToDelete] =
    useState<InventoryAccount | null>(null);

  function openAccount(accountId: number) {
    const route =
      workspace === "PAR"
        ? "par"
        : workspace === "HIGH_COST"
          ? "high-cost"
          : "low-cost";

    navigate(`/${route}/${accountId}/records`);
  }

  function requestDelete(account: InventoryAccount) {
    setAccountToDelete(account);
  }

  function closeDeleteDialog() {
    if (deleteMutation.isPending) return;

    setAccountToDelete(null);
  }

  async function confirmDelete() {
    if (!canManageAccounts) return;
    if (!accountToDelete) return;

    try {
      await deleteMutation.mutateAsync(accountToDelete.id);
      setAccountToDelete(null);
    } catch (error) {
      console.error("Failed deleting inventory account", error);
    }
  }

  return (
    <>
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
                  colSpan={canManageAccounts ? 6 : 5}
                  className="px-6 py-14 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No inventory accounts found.
                </td>
              </tr>
            ) : (
              accounts.map((account, index) => (
                <tr
                  key={account.id}
                  onClick={() => openAccount(account.id)}
                  className="
                      group cursor-pointer
                      bg-white
                      text-sm text-slate-700
                      transition-colors
                      hover:bg-emerald-50/50

                      dark:bg-slate-900
                      dark:text-slate-300
                      dark:hover:bg-emerald-950/20
                    "
                >
                  <td className="px-4 py-3.5 text-center text-slate-500 dark:text-slate-500">
                    {index + 1}
                  </td>

                  <td className="px-4 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                    {account.account_title}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums">
                    {formatNumber(account.book_value)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-right font-medium tabular-nums text-slate-900 dark:text-slate-100">
                    {formatCurrency(account.per_inventory_report)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums">
                    {formatNumber(account.variance)}
                  </td>

                  {canManageAccounts && (
                    <td
                      className="px-3 py-2"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Dropdown
                        trigger={
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-label={`Actions for ${account.account_title}`}
                          >
                            <Ellipsis size={18} />
                          </Button>
                        }
                      >
                        <DropdownItem onClick={() => onEdit(account)}>
                          <Pencil size={16} />
                          Edit Account
                        </DropdownItem>

                        <DropdownItem
                          danger
                          onClick={() => requestDelete(account)}
                        >
                          <Trash2 size={16} />
                          Delete Account
                        </DropdownItem>
                      </Dropdown>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
