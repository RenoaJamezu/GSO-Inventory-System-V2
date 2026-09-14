import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

import { Card, PageHeader } from "@/components/ui";

import InventoryAccountsTable from "../components/InventoryAccountsTable";
import InventoryAccountDialog from "../components/InventoryAccountDialog";
import InventoryAccountToolbar from "../components/InventoryAccountToolbar";

import { useInventoryAccounts } from "..";
import { useInventoryAccountsPage } from "../hooks/useInventoryAccountsPage";

export default function InventoryWorkspacePage() {
  const { pathname } = useLocation();

  const {
    dialogOpen,
    selectedAccountId,
    createAccount,
    editAccount,
    closeAccountDialog,
    exportExcel,
  } = useInventoryAccountsPage();

  const workspace = {
    "/par": {
      title: "PAR Inventory",
      description: "Property Acknowledgement Receipt items issued to officers",
      visibilityField: "is_par_visible" as const,
    },

    "/high-cost": {
      title: "ICS - High Cost",
      description: "High Cost Semi-Expendable Property Inventory",
      visibilityField: "is_high_cost_visible" as const,
    },

    "/low-cost": {
      title: "ICS - Low Cost",
      description: "Low Cost Semi-Expendable Property Inventory",
      visibilityField: "is_low_cost_visible" as const,
    },
  }[pathname];

  const inventoryType =
    pathname === "/par"
      ? "PAR"
      : pathname === "/high-cost"
        ? "HIGH_COST"
        : "LOW_COST";

  const { data = [], isLoading, error } = useInventoryAccounts(inventoryType);

  const [search, setSearch] = useState("");

  const filteredAccounts = useMemo(() => {
    if (!workspace) return [];

    return data
      .filter((account) => account[workspace.visibilityField])
      .filter((account) =>
        account.account_title.toLowerCase().includes(search.toLowerCase()),
      );
  }, [data, search, workspace]);

  const selectedAccount = useMemo(() => {
    if (selectedAccountId == null) return null;

    return data.find((account) => account.id === selectedAccountId) ?? null;
  }, [data, selectedAccountId]);

  if (isLoading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading inventory accounts...
      </div>
    );
  }

  if (error) {
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
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-sm"
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

        <span className="font-medium text-slate-700 dark:text-slate-200">
          {workspace.title}
        </span>
      </nav>

      {/* Header */}
      <PageHeader title={workspace.title} description={workspace.description} />

      {/* Workspace */}
      <Card padding="none">
        <InventoryAccountToolbar
          search={search}
          onSearchChange={setSearch}
          onAddAccount={createAccount}
          onAddRecord={() => {}}
          onExportExcel={() => exportExcel(workspace, filteredAccounts)}
          onGeneratePPESummary={() => {}}
        />

        <InventoryAccountsTable
          accounts={filteredAccounts}
          workspace={inventoryType}
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
