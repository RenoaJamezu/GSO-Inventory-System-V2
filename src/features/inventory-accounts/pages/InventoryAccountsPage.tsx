import { useMemo, useState } from "react";


import { useInventoryAccounts } from "../hooks/useInventoryAccounts";

import type { InventoryAccount } from "../types";
import { InventoryAccountsTable } from "../components/InventoryAccountsTable";
import { InventoryAccountDialog } from "../components/InventoryAccountDialog";

export default function InventoryAccountPage() {
  const { data = [], isLoading, error } = useInventoryAccounts();

  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);

  const [selectedAccount, setSelectedAccount] =
    useState<InventoryAccount | null>(null);

  const filteredAccounts = useMemo(() => {
    return data.filter((account) =>
      account.account_title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  if (isLoading) return <div className="p-6">Loading...</div>;

  if (error) return <div className="p-6">Error loading data.</div>;

  return (
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-4 flex justify-between">
        <input
          className="rounded border px-3 py-2"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          onClick={() => {
            setSelectedAccount(null);
            setOpen(true);
          }}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Add Account
        </button>
      </div>

      <InventoryAccountsTable
        accounts={filteredAccounts}
        onEdit={(account) => {
          setSelectedAccount(account);
          setOpen(true);
        }}
      />

      <InventoryAccountDialog
        open={open}
        account={selectedAccount}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}
