import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

import type { AccountColumn } from "@/features/account-columns";
import type { InventoryRecord } from "../../types";

import { Button } from "@/components/ui";

import InventoryRecordQr from "./InventoryRecordQr";
import InventoryRecordActions from "./InventoryRecordActions";
import InventoryRecordFields from "./InventoryRecordFields";

import { getRecordAmount } from "../../utils/getRecordAmount";
import InventoryRecordPrintLayout from "../InventoryRecordPrintLayout";
import InventoryRecordQrCard from "../InventoryRecordQrCard";

type Props = {
  open: boolean;

  record: InventoryRecord | null;
  columns: AccountColumn[];

  accountTitle: string;

  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function InventoryRecordSidePanel({
  open,
  record,
  columns,
  accountTitle,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `QR-${record?.id ?? ""}`,
  });

  if (!open || !record) return null;

  const amount = getRecordAmount(columns, record.data);

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Hidden printable content */}
      <div className="hidden">
        <div ref={printRef}>
          <InventoryRecordPrintLayout>
            <InventoryRecordQrCard
              qrUuid={record.qr_uuid}
              amount={amount}
            />
          </InventoryRecordPrintLayout>
        </div>
      </div>

      {/* Panel */}
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-lg flex-col border-l border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold capitalize">{accountTitle}</h2>

            <p className="text-sm text-gray-500">Inventory Record: ID #{record.id}</p>
          </div>

          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Scrollable */}
        <div className="flex-1 overflow-y-auto">
          {/* QR */}
          <InventoryRecordQr qrUuid={record.qr_uuid} amount={amount} />

          {/* Actions */}
          <InventoryRecordActions
            onEdit={onEdit}
            onPrintQr={handlePrint}
            onDelete={onDelete}
          />

          {/* Dynamic Fields */}
          <InventoryRecordFields columns={columns} data={record.data} />
        </div>
      </aside>
    </>
  );
}
