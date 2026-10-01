import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui";
import { PERMISSIONS, usePermissions } from "@/features/auth";

type Props = {
  selectedCount: number;
  isDeleting: boolean;
  onDelete: () => void;
};

export default function VehicleRecordBulkToolbar({
  selectedCount,
  isDeleting,
  onDelete,
}: Props) {
  const { can } = usePermissions();

  const canDelete = can(PERMISSIONS.VEHICLE_DELETE);

  if (!selectedCount) {
    return null;
  }

  return (
    <section
      className="
        rounded-lg border
        border-emerald-200
        bg-emerald-50/70
        p-4

        dark:border-emerald-900
        dark:bg-emerald-950/30
      "
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            {selectedCount} vehicle record
            {selectedCount !== 1 ? "s" : ""} selected
          </p>

          <p className="mt-0.5 text-xs text-emerald-700/70 dark:text-emerald-400/70">
            Apply an action to the selected vehicle records.
          </p>
        </div>

        {canDelete && (
          <Button
            variant="danger"
            disabled={isDeleting}
            loading={isDeleting}
            loadingText="Deleting..."
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 shrink-0" />
            Delete
          </Button>
        )}
      </div>
    </section>
  );
}
