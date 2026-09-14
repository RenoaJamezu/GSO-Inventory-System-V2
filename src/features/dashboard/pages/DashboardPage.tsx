import { Boxes, FileText, Package } from "lucide-react";

import { PageHeader, StatCard } from "@/components/ui";

import { formatCurrency } from "@/lib/utils/format";

import { useDashboard } from "../hooks/useDashboard";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of property and inventory records managed by the General Services Office."
      />

      <section>
        <div className="mb-4">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Inventory Summary
          </h2>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Current inventory values and number of records by category.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={<FileText size={19} />}
            colorTheme="emerald"
            title="PAR Total"
            value={isLoading ? "—" : formatCurrency(data?.par.total ?? 0)}
            route="/par"
            description={
              isLoading
                ? "Loading records..."
                : `${data?.par.records ?? 0} records`
            }
          />

          <StatCard
            icon={<Package size={19} />}
            colorTheme="gray"
            title="High Cost Total"
            value={isLoading ? "—" : formatCurrency(data?.highCost.total ?? 0)}
            route="/high-cost"
            description={
              isLoading
                ? "Loading records..."
                : `${data?.highCost.records ?? 0} records`
            }
          />

          <StatCard
            icon={<Boxes size={19} />}
            colorTheme="gray"
            title="Low Cost Total"
            value={isLoading ? "—" : formatCurrency(data?.lowCost.total ?? 0)}
            route="/low-cost"
            description={
              isLoading
                ? "Loading records..."
                : `${data?.lowCost.records ?? 0} records`
            }
          />
        </div>
      </section>
    </div>
  );
}
