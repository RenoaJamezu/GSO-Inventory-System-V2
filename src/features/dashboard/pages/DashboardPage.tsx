import { StatCard } from "@/components/ui";
import { Boxes, FileText, Package } from "lucide-react";
import { useDashboard } from "../hooks/useDashboard";
import { formatCurrency } from "@/lib/utils/format";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

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

      <div className="grid gap-6 xl:grid-cols-3">
        <StatCard
          icon={<FileText size={18} />}
          colorTheme="blue"
          title="PAR Total"
          value={isLoading ? "--" : formatCurrency(data?.par.total ?? 0)}
          route="/par"
          description={
            isLoading ? "-- records" : `${data?.par.records} records`
          }
        />

        <StatCard
          icon={<Package size={18} />}
          colorTheme="orange"
          title="High Cost Total"
          value={isLoading ? "--" : formatCurrency(data?.highCost.total ?? 0)}
          route="/high-cost"
          description={
            isLoading ? "-- records" : `${data?.highCost.records} records`
          }
        />

        <StatCard
          icon={<Boxes size={18} />}
          colorTheme="purple"
          title="Low Cost Total"
          value={isLoading ? "--" : formatCurrency(data?.lowCost.total ?? 0)}
          route="/low-cost"
          description={
            isLoading ? "-- records" : `${data?.lowCost.records} records`
          }
        />
      </div>
    </div>
  );
}
