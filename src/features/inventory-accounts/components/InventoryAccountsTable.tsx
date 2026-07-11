import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

import { useDeleteInventoryAccount } from "../hooks/useInventoryAccounts";
import type { InventoryAccount } from "../types";

type InventoryAccountsTableProps = {
  accounts: InventoryAccount[];
  onEdit: (account: InventoryAccount) => void;
};

export default function InventoryAccountsTable({
  accounts,
  onEdit,
}: InventoryAccountsTableProps) {
  const navigate = useNavigate();

  const deleteMutation = useDeleteInventoryAccount();

  function handleDelete(account: InventoryAccount) {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${account.account_title}"?`,
    );

    if (!confirmed) return;

    deleteMutation.mutate(account.id);
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="max-h-102 overflow-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr className="text-sm font-semibold text-gray-700">
              <th className="border-b border-gray-200 px-4 py-3 text-center w-20">
                No.
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-left">
                Account Title
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-right">
                Book Value
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-right">
                Per Inventory Report
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-right">
                Variance
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-center w-72">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {accounts.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  No inventory accounts found.
                </td>
              </tr>
            ) : (
              accounts.map((account, index) => (
                <tr
                  key={account.id}
                  onClick={() =>
                    navigate(`/inventory-accounts/${account.id}/records`)
                  }
                  className="
                    cursor-pointer
                    odd:bg-white
                    even:bg-gray-50
                    hover:bg-blue-50
                    transition-colors
                    capitalize
                  "
                >
                  <td className="border-b border-gray-100 px-4 py-3 text-center">
                    {index + 1}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3 font-medium text-gray-800">
                    {account.account_title}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3 text-right tabular-nums">
                    {formatNumber(account.book_value)}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3 text-right tabular-nums">
                    {formatCurrency(account.per_inventory_report)}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3 text-right tabular-nums">
                    {formatNumber(account.variance)}
                  </td>

                  <td className="border-b border-gray-100 px-4 py-3">
                    <div className="flex flex-wrap justify-center gap-2">
                      <Button
                        size="sm"
                        variant="warning"
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit(account);
                        }}
                      >
                        Edit
                      </Button>

                      <Button
                        size="sm"
                        variant="danger"
                        loading={deleteMutation.isPending}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(account);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
