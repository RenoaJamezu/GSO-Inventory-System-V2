import { StatCard } from "@/components/ui";
import { formatCurrency } from "@/lib/utils/format";

type Props = {
  totalRecords: number;
  totalAmount: number;
  totalGroups: number;
};

export default function InventoryRecordStats({
  totalRecords,
  totalAmount,
  totalGroups,
}: Props) {
  return (
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <StatCard
        title="Total Records"
        value={totalRecords.toLocaleString()}
        subtitle="Inventory records"
      />

      <StatCard
        title="Total Amount"
        value={formatCurrency(totalAmount)}
        subtitle="Total inventory value"
      />

      <StatCard
        title="Groups"
        value={totalGroups}
        subtitle="Available record groups"
      />
    </div>
  );
}
