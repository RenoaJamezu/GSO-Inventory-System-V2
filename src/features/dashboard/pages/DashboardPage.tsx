import { Boxes, Database, FileText, Package } from "lucide-react";

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
          icon={<FileText size={15} />}
          colorTheme="text-blue-500 bg-blue-100"
          title="PAR Total"
          value="--"
        />

        <DashboardCard
          icon={<Package size={15} />}
          colorTheme="text-orange-500 bg-orange-100"
          title="High Cost Total"
          value="--"
        />

        <DashboardCard
          icon={<Boxes size={15} />}
          colorTheme="text-purple-500 bg-purple-100"
          title="Low Cost Total"
          value="--"
        />

        <DashboardCard
          icon={<Database size={15} />}
          colorTheme="text-gray-500 bg-gray-100"
          title="Inventory Records"
          value="--"
        />
      </div>
    </div>
  );
}

type DashboardCardProps = {
  icon: React.ReactNode;
  colorTheme: string;
  title: string;
  value: string;
  description?: string;
};

function DashboardCard({
  icon,
  colorTheme,
  title,
  value,
  description,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        <span className={`p-2 rounded-lg border shadow-md ${colorTheme}`}>
          {icon}
        </span>
      </div>

      <h2 className="mt-3 text-3xl font-bold text-gray-900">{value}</h2>

      <p className="mt-2 text-sm text-gray-500">{description}</p>
    </div>
  );
}
