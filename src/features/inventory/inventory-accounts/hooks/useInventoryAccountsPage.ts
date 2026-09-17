import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";

import { exportAllInventory } from "../../export";
import type { InventoryAccount } from "../types";
import {
  getInventoryWorkspace,
  isAccountVisibleInWorkspace,
} from "../utils/getInventoryWorkspace";

import { useInventoryAccounts } from "./useInventoryAccounts";

const EMPTY_ACCOUNTS: InventoryAccount[] = [];

export function useInventoryAccountsPage() {
  const { pathname } = useLocation();

  const workspace = getInventoryWorkspace(pathname);
  const inventoryType = workspace?.inventoryType ?? "PAR";

  const accountsQuery = useInventoryAccounts(inventoryType);
  const accounts = accountsQuery.data ?? EMPTY_ACCOUNTS;

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );

  const workspaceAccounts = useMemo(() => {
    if (!workspace) {
      return [];
    }

    return accounts.filter((account) =>
      isAccountVisibleInWorkspace(account, workspace),
    );
  }, [accounts, workspace]);

  const filteredAccounts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return workspaceAccounts;
    }

    return workspaceAccounts.filter((account) =>
      account.account_title.toLowerCase().includes(normalizedSearch),
    );
  }, [search, workspaceAccounts]);

  const selectedAccount = useMemo(() => {
    if (selectedAccountId === null) {
      return null;
    }

    return accounts.find((account) => account.id === selectedAccountId) ?? null;
  }, [accounts, selectedAccountId]);

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

  async function exportExcel() {
    if (!workspace) {
      return;
    }

    await exportAllInventory({
      inventoryType,
      filename: `${workspace.title}.xlsx`,
      accounts: workspaceAccounts,
    });
  }

  return {
    workspace,
    inventoryType,
    filteredAccounts,
    selectedAccount,
    search,
    setSearch,
    dialogOpen,
    accountsQuery,
    createAccount,
    editAccount,
    closeAccountDialog,
    exportExcel,
  };
}
