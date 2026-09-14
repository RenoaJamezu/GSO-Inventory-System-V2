import { X } from "lucide-react";

import { Button } from "@/components/ui";

import type { VehicleRecord } from "../../types";

import VehicleRecordActions from "./VehicleRecordActions";
import VehicleRecordFields from "./VehicleRecordFields";

type Props = {
  open: boolean;

  vehicle: VehicleRecord | null;

  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function VehicleRecordSidePanel({
  open,
  vehicle,
  onClose,
  onEdit,
  onDelete,
}: Props) {
  if (!open || !vehicle) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />

      <aside
        className="
          fixed right-0 top-0 z-50
          flex h-screen w-full max-w-lg flex-col
          border-l border-slate-200
          bg-white
          shadow-xl

          dark:border-slate-800
          dark:bg-slate-900
        "
      >
        {/* Header */}
        <header
          className="
            flex items-start
            justify-between
            gap-4
            border-b
            border-slate-200
            px-6 py-5

            dark:border-slate-800
          "
        >
          <div className="min-w-0">
            <p
              className="
                text-xs font-semibold
                uppercase tracking-wide
                text-emerald-700

                dark:text-emerald-400
              "
            >
              Vehicle Record
            </p>

            <h2
              className="
                mt-1 truncate
                text-xl font-semibold
                text-slate-900

                dark:text-slate-100
              "
            >
              {vehicle.plate_no}
            </h2>

            <p
              className="
                mt-1 truncate
                text-sm
                text-slate-500

                dark:text-slate-400
              "
            >
              {vehicle.model}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close vehicle details"
          >
            <X size={18} />
          </Button>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <VehicleRecordActions onEdit={onEdit} onDelete={onDelete} />

          <VehicleRecordFields vehicle={vehicle} />
        </div>
      </aside>
    </>
  );
}
