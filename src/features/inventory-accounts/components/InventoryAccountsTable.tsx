import { useNavigate } from "react-router-dom";
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

  const handleDelete = (account: InventoryAccount) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${account.account_title}"?`,
    );

    if (!confirmed) return;

    deleteMutation.mutate(account.id);
  };

  return (
    <div className="overflow-x-auto rounded border">
      <table className="table-fixed min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-center">No.</th>

            <th className="border px-4 py-2 text-left">Account Title</th>

            <th className="border px-4 py-2 text-right">Book Value</th>

            <th className="border px-4 py-2 text-right">
              Per Inventory Report
            </th>

            <th className="border px-4 py-2 text-right">Variance</th>

            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {accounts.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className="border px-4 py-8 text-center text-gray-500"
              >
                No inventory accounts found.
              </td>
            </tr>
          )}

          {accounts.map((account, index) => (
            <tr key={account.id} className="hover:bg-gray-50 capitalize">
              <td className="border px-4 py-2 text-center">{index + 1}</td>

              <td className="border px-4 py-2">{account.account_title}</td>

              <td className="border px-4 py-2 text-right">
                {Number(account.book_value).toLocaleString()}
              </td>

              <td className="border px-4 py-2 text-right">
                {Number(account.per_inventory_report).toLocaleString()}
              </td>

              <td className="border px-4 py-2 text-right">
                {Number(account.variance).toLocaleString()}
              </td>

              <td className="border px-4 py-2">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() =>
                      navigate(`/inventory-accounts/${account.id}/records`)
                    }
                    className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                  >
                    Records
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/inventory-accounts/${account.id}/columns`)
                    }
                    className="rounded bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                  >
                    Columns
                  </button>

                  <button
                    onClick={() => onEdit(account)}
                    className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(account)}
                    disabled={deleteMutation.isPending}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
