import { useState } from "react";
import type { InventoryAccount } from "../types";
import { exportWorkspace } from "../../export";

export function useInventoryAccountsPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );

  function createAccount() {
    setSelectedAccountId(null);
    setDialogOpen(true);
  }

  function editAccount(account: InventoryAccount) {
    setSelectedAccountId(account.id);
    setDialogOpen(true);
  }

  function closeAccountDialog() {
    setDialogOpen(false);
    setSelectedAccountId(null);
  }

  async function exportExcel(
    workspace: { title: string },
    filteredAccounts: InventoryAccount[],
  ) {
    await exportWorkspace({
      title: workspace.title,
      filename: `${workspace.title}.xlsx`,
      accounts: filteredAccounts,
    });
  }

  return {
    dialogOpen,
    selectedAccountId,
    createAccount,
    editAccount,
    closeAccountDialog,

    exportExcel,
  };
}
