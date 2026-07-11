import { Link } from "react-router-dom";

type Props = {
  accountTitle: string;
};

export default function InventoryRecordsPageHeader({ accountTitle }: Props) {
  return (
    <header className="mb-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
        <Link
          to="/inventory-accounts"
          className="transition-colors hover:text-emerald-600"
        >
          Inventory Accounts
        </Link>

        <span>/</span>

        <span className="font-medium capitalize text-gray-900">
          {accountTitle}
        </span>
      </nav>

      {/* Title */}
      <div>
        <h1 className="text-3xl font-bold capitalize">{accountTitle}</h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage inventory records for this account.
        </p>
      </div>
    </header>
  );
}
