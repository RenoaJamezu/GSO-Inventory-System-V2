import { QrCode } from "lucide-react";

import InventoryRecordQrCard from "../InventoryRecordQrCard";
import type { InventoryType } from "../../types";

type Props = {
  qrUuid: string;
  inventoryType: InventoryType;
};

export default function InventoryRecordQr({ qrUuid, inventoryType }: Props) {
  return (
    <section
      className="
        border-b border-slate-200
        px-6 py-6
        dark:border-slate-800
      "
    >
      <div className="mb-4 flex items-center gap-2">
        <QrCode size={16} className="text-slate-500 dark:text-slate-400" />

        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Property QR Label
        </h3>
      </div>

      <div
        className="
          overflow-x-auto
          rounded-lg border
          border-slate-200
          bg-slate-50
          p-4

          dark:border-slate-800
          dark:bg-slate-950/50
        "
      >
        <div className="flex min-w-max justify-center">
          <InventoryRecordQrCard
            qrUuid={qrUuid}
            inventoryType={inventoryType}
          />
        </div>
      </div>

      <div className="mt-3">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          QR UUID
        </p>

        <p
          className="
            mt-1 break-all
            font-mono text-xs
            text-slate-700
            dark:text-slate-300
          "
        >
          {qrUuid}
        </p>
      </div>
    </section>
  );
}
