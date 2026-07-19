import { Link, useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

import { Card } from "@/components/ui";
import InventoryAccountsTable from "../components/InventoryAccountsTable";
import InventoryAccountDialog from "../components/InventoryAccountDialog";
import { useInventoryAccounts } from "..";
import InventoryAccountToolbar from "../components/InventoryAccountToolbar";
import { useInventoryAccountsPage } from "../hooks/useInventoryAccountsPage";

export default function InventoryWorkspacePage() {
  const { pathname } = useLocation();
  const {
    dialogOpen,
    selectedAccountId,
    createAccount,
    editAccount,
    closeAccountDialog,

    exportExcel
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
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading inventory accounts.</div>;
  }

  if (!workspace) {
    return <div>Invalid workspace.</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Breadcrumb */}

      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <Link
          to="/dashboard"
          className="transition-colors hover:text-emerald-600"
        >
          Home
        </Link>

        <span>/</span>

        <span className="font-medium text-gray-900">{workspace?.title}</span>
      </nav>

      <hr className="border-gray-200" />

      {/* Header */}

      <header className="space-y-2">
        <h2 className="text-4xl font-bold">{workspace?.title}</h2>
        <p className="text-gray-500">{workspace?.description}</p>
      </header>

      {/* Workspace */}

      <Card padding="none">
        {/* Toolbar */}

        <InventoryAccountToolbar
          search={search}
          onSearchChange={setSearch}
          onAddAccount={createAccount}
          onAddRecord={() => {}}
          onExportExcel={() => exportExcel(workspace, filteredAccounts)}
          onGeneratePPESummary={() => {}}
        />

        {/* Table */}

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
