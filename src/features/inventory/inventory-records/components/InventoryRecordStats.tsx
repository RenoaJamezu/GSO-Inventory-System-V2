import { StatCard } from "@/components/ui";
import { formatCurrency } from "@/lib/utils/format";
import { FileText, PhilippinePeso } from "lucide-react";

type Props = {
  totalRecords: number;
  totalAmount: number;
};

export default function InventoryRecordStats({
  totalRecords,
  totalAmount,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <StatCard
        icon={<FileText size={15} />}
        colorTheme="gray"
        title="Total Records"
        value={totalRecords.toLocaleString()}
      />

      <StatCard
        icon={<PhilippinePeso size={15} />}
        colorTheme="gray"
        title="Total Amount"
        value={formatCurrency(totalAmount)}
      />
    </div>
  );
}
