import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import { Card, PageHeader } from "@/components/ui";

import InventoryAccountDialog from "../components/InventoryAccountDialog";
import InventoryAccountsTable from "../components/InventoryAccountsTable";
import InventoryAccountToolbar from "../components/InventoryAccountToolbar";
import { useInventoryAccountsPage } from "../hooks/useInventoryAccountsPage";

export default function InventoryWorkspacePage() {
  const {
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
  } = useInventoryAccountsPage();

  if (accountsQuery.isLoading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading inventory accounts...
      </div>
    );
  }

  if (accountsQuery.error) {
    return (
      <div className="py-12 text-center text-sm text-red-600 dark:text-red-400">
        Error loading inventory accounts.
      </div>
    );
  }

  if (!workspace) {
    return (
      <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Invalid workspace.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400"
      >
        <Link
          to="/dashboard"
          className="transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
        >
          Dashboard
        </Link>

        <ChevronRight size={14} />

        <span className="font-medium text-slate-700 dark:text-slate-300">
          {workspace.title}
        </span>
      </nav>

      <PageHeader title={workspace.title} description={workspace.description} />

      <Card className="overflow-hidden">
        <InventoryAccountToolbar
          search={search}
          onSearchChange={setSearch}
          onAddAccount={createAccount}
          onExportExcel={exportExcel}
        />

        <InventoryAccountsTable
          accounts={filteredAccounts}
          workspaceRoute={workspace.route}
          isFiltered={search.trim().length > 0}
          onEdit={editAccount}
        />
      </Card>

      <InventoryAccountDialog
        open={dialogOpen}
        account={selectedAccount}
        workspace={inventoryType}
        onClose={closeAccountDialog}
      />
    </div>
  );
}
