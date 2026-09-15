import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui";

import { PERMISSIONS, usePermissions } from "@/features/auth";

type Props = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function VehicleRecordActions({ onEdit, onDelete }: Props) {
  const { can } = usePermissions();

  const canEdit = can(PERMISSIONS.VEHICLE_UPDATE);

  const canDelete = can(PERMISSIONS.VEHICLE_DELETE);

  if (!canEdit && !canDelete) {
    return null;
  }

  return (
    <section
      className="
        border-b
        border-slate-200
        px-6 py-5
        dark:border-slate-800
      "
    >
      <h3
        className="
          text-xs font-semibold
          uppercase tracking-wide
          text-slate-500
          dark:text-slate-400
        "
      >
        Actions
      </h3>

      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {canEdit && (
          <Button
            type="button"
            onClick={onEdit}
            className="flex items-center justify-center gap-2"
          >
            <Pencil size={16} />
            Edit Vehicle
          </Button>
        )}

        {canDelete && (
          <Button
            type="button"
            variant="danger"
            onClick={onDelete}
            className="flex items-center justify-center gap-2"
          >
            <Trash2 size={16} />
            Delete Vehicle
          </Button>
        )}
      </div>
    </section>
  );
}
