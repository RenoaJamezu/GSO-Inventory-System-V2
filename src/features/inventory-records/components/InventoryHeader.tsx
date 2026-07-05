import { useNavigate } from "react-router-dom";
import type { InventoryAccount } from "@/features/inventory-accounts";

type Props = {
  account: InventoryAccount;
  onAdd: () => void;
  onImport: () => void;
  onDownloadTemplate: () => void;
  onManageGroups: () => void;
};

export default function InventoryHeader({
  account,
  onAdd,
  onImport,
  onDownloadTemplate,
  onManageGroups,
}: Props) {
  const navigate = useNavigate();

  return (
    <div className="mb-6 mt-4 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold capitalize">
            {account.account_title}
          </h1>

          <p className="text-gray-500">Inventory Records</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onAdd}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Add Record
          </button>

          <button
            onClick={onImport}
            className="rounded bg-purple-600 px-4 py-2 font-medium text-white hover:bg-purple-700"
          >
            Import Excel
          </button>

          <details className="relative">
            <summary className="cursor-pointer list-none rounded border bg-white px-4 py-2 hover:bg-gray-50">
              Tools
            </summary>

            <div className="absolute right-0 z-20 mt-2 w-56 rounded-lg border bg-white shadow-lg">
              <button
                onClick={onDownloadTemplate}
                className="block w-full px-4 py-3 text-left hover:bg-gray-100"
              >
                Download Template
              </button>

              <button
                onClick={() =>
                  navigate(`/inventory-accounts/${account.id}/columns`)
                }
                className="block w-full px-4 py-3 text-left hover:bg-gray-100"
              >
                Manage Columns
              </button>

              <button
                onClick={onManageGroups}
                className="block w-full px-4 py-3 text-left hover:bg-gray-100"
              >
                Manage Groups
              </button>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
