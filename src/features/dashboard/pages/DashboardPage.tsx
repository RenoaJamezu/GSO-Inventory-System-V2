import { Link } from "react-router-dom";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome to the Inventory Management System.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Inventory Accounts"
          value="--"
          description="Total account titles"
        />

        <DashboardCard
          title="Inventory Records"
          value="--"
          description="Total inventory records"
        />

        <DashboardCard
          title="Groups"
          value="--"
          description="Configured groups"
        />

        <DashboardCard
          title="Reports"
          value="--"
          description="Available reports"
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Quick Actions
        </h2>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/inventory-accounts"
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
          >
            Manage Inventory Accounts
          </Link>

          <Link
            to="/reports/ppe-summary"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            View PPE Summary
          </Link>
        </div>
      </div>
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  value: string;
  description: string;
};

function DashboardCard({ title, value, description }: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <p className="text-sm font-medium text-gray-500">{title}</p>

      <h2 className="mt-3 text-3xl font-bold text-gray-900">{value}</h2>

      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
}
