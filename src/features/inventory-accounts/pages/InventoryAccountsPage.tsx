import { useMemo, useState } from "react";

import { PPESummaryDialog } from "@/features/reporting/ppe-summary";

import InventoryAccountDialog from "../components/InventoryAccountDialog";
import InventoryAccountsTable from "../components/InventoryAccountsTable";

import { useInventoryAccounts } from "../hooks/useInventoryAccounts";

import type { InventoryAccount } from "../types";

import { CirclePlus } from "lucide-react";
import {
  Button,
  Card,
  PageHeader,
  SearchField,
  Toolbar,
} from "@/components/ui";

export default function InventoryAccountPage() {
  const { data = [], isLoading, error } = useInventoryAccounts();

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [summaryOpen, setSummaryOpen] = useState(false);

  const [selectedAccount, setSelectedAccount] =
    useState<InventoryAccount | null>(null);

  const filteredAccounts = useMemo(() => {
    return data.filter((account) =>
      account.account_title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6">Error loading data.</div>;
  }

  return (
    <div  className="mx-auto flex w-full max-w-7xl flex-col gap-6">
      {/* Breadcrumb */}

      <nav className="flex items-center gap-2 text-sm text-gray-500">
        <span className="font-medium text-gray-900">Inventory Accounts</span>
      </nav>

      <PageHeader
        title="Inventory Accounts"
        description="Manage inventory account titles and generate inventory reports."
      />

      <Toolbar
        left={
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder="Search account title..."
          />
        }
        right={
          <>
            <Button variant="success" onClick={() => setSummaryOpen(true)}>
              Generate PPE Summary
            </Button>

            <Button
              className="flex gap-1 item-center"
              onClick={() => {
                setSelectedAccount(null);
                setOpen(true);
              }}
            >
              <CirclePlus size={20} />
              Add Account
            </Button>
          </>
        }
      />

      <Card padding="none">
        <InventoryAccountsTable
          accounts={filteredAccounts}
          onEdit={(account) => {
            setSelectedAccount(account);
            setOpen(true);
          }}
        />
      </Card>

      <InventoryAccountDialog
        open={open}
        account={selectedAccount}
        onClose={() => setOpen(false)}
      />

      <PPESummaryDialog
        open={summaryOpen}
        onClose={() => setSummaryOpen(false)}
      />
    </div>
  );
}
