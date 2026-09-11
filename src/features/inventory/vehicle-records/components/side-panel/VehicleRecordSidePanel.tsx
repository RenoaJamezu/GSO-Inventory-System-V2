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
  if (!open || !vehicle) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <aside className="fixed right-0 top-0 z-50 flex h-screen w-full max-w-lg flex-col border-l border-gray-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold uppercase">
              {vehicle.plate_no}
            </h2>

            <p className="mt-1 truncate text-sm text-gray-500">
              {vehicle.model}
            </p>
          </div>

          <Button variant="ghost" onClick={onClose}>
            ✕
          </Button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <VehicleRecordActions onEdit={onEdit} onDelete={onDelete} />

          <VehicleRecordFields vehicle={vehicle} />
        </div>
      </aside>
    </>
  );
}
