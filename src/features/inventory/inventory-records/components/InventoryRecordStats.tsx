import { FileText, PhilippinePeso } from "lucide-react";

import { StatCard } from "@/components/ui";

import { formatCurrency } from "@/lib/utils/format";

interface InventoryRecordStatsProps {
  totalRecords: number;
  totalAmount: number;
}

export default function InventoryRecordStats({
  totalRecords,
  totalAmount,
}: InventoryRecordStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <StatCard
        icon={<FileText size={15} />}
        tone="neutral"
        label="Total Records"
        value={totalRecords.toLocaleString()}
      />

      <StatCard
        icon={<PhilippinePeso size={15} />}
        tone="neutral"
        label="Total Amount"
        value={formatCurrency(totalAmount)}
      />
    </div>
  );
}
