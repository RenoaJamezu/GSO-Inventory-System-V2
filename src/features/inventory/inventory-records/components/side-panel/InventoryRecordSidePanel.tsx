import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { X } from "lucide-react";

import type { AccountColumn } from "@/features/inventory/account-columns";
import type { InventoryRecord } from "../../types";

import { Button } from "@/components/ui";

import InventoryRecordQr from "./InventoryRecordQr";
import InventoryRecordActions from "./InventoryRecordActions";
import InventoryRecordFields from "./InventoryRecordFields";

import InventoryRecordPrintLayout from "../InventoryRecordPrintLayout";
import InventoryRecordQrCard from "../InventoryRecordQrCard";

type Props = {
  open: boolean;

  record: InventoryRecord | null;
  columns: AccountColumn[];

  accountTitle: string;

  onClose: () => void;
  onEdit: () => void;
  onPublicView: () => void;
  onDelete: () => void;
};

export default function InventoryRecordSidePanel({
  open,
  record,
  columns,
  accountTitle,
  onClose,
  onEdit,
  onPublicView,
  onDelete,
}: Props) {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `QR-${record?.id ?? ""}`,
  });

  if (!open || !record) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Hidden printable content */}
      <div className="hidden">
        <div ref={printRef}>
          <InventoryRecordPrintLayout>
            <InventoryRecordQrCard
              qrUuid={record.qr_uuid}
              inventoryType={record.inventory_type}
            />
          </InventoryRecordPrintLayout>
        </div>
      </div>

      {/* Side panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={`Inventory record ${record.id}`}
        className="
          fixed right-0 top-0 z-50
          flex h-screen w-full
          max-w-lg flex-col

          border-l border-slate-200
          bg-white
          shadow-xl

          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        {/* Header */}
        <div
          className="
            flex items-start
            justify-between gap-4
            border-b border-slate-200
            px-6 py-5

            dark:border-slate-800
          "
        >
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-400">
              Inventory Record
            </p>

            <h2 className="mt-1 truncate text-xl font-semibold text-slate-900 dark:text-slate-100">
              {accountTitle}
            </h2>

            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Record ID #{record.id}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close record details"
          >
            <X size={19} />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <InventoryRecordQr
            qrUuid={record.qr_uuid}
            inventoryType={record.inventory_type}
          />

          <InventoryRecordActions
            onEdit={onEdit}
            onPrintQr={handlePrint}
            onPublicView={onPublicView}
            onDelete={onDelete}
          />

          <InventoryRecordFields columns={columns} data={record.data} />
        </div>
      </aside>
    </>
  );
}
