import { Link, useLocation } from "react-router-dom";
import { CirclePlus } from "lucide-react";
import { useMemo, useState } from "react";

import { Button, Card, SearchField } from "@/components/ui";
import InventoryAccountsTable from "../components/InventoryAccountsTable";
import InventoryAccountDialog from "../components/InventoryAccountDialog";
import { useInventoryAccounts } from "..";

export default function InventoryWorkspacePage() {
  const { pathname } = useLocation();

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

  const [open, setOpen] = useState(false);

  const [selectedAccountId, setSelectedAccountId] = useState<number | null>(
    null,
  );

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

        <div className="flex items-center justify-between border-b border-gray-200 p-5">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search accounts..."
          />

          <div className="flex items-center gap-3">
            <Button variant="secondary">Generate PPE Summary</Button>

            <Button variant="secondary">Export Excel</Button>

            <Button variant="secondary">Add Record</Button>

            <Button
              className="flex items-center gap-2"
              onClick={() => {
                setSelectedAccountId(null);
                setOpen(true);
              }}
            >
              <CirclePlus size={18} />
              Add Account
            </Button>
          </div>
        </div>

        {/* Table */}

        <InventoryAccountsTable
          accounts={filteredAccounts}
          workspace={inventoryType}
          onEdit={(account) => {
            setSelectedAccountId(account.id);
            setOpen(true);
          }}
        />
      </Card>

      <InventoryAccountDialog
        open={open}
        account={selectedAccount}
        workspace={inventoryType}
        onClose={() => {
          setOpen(false);
          setSelectedAccountId(null);
        }}
      />
    </div>
  );
}
