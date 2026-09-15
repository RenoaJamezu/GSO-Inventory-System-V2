import { Printer, Trash2 } from "lucide-react";

import { FormSelect } from "@/components/form";
import { Button } from "@/components/ui";

import type { Group } from "../types";
import { PERMISSIONS, usePermissions } from "@/features/auth";

type Props = {
  selectedCount: number;

  groups: Group[];

  selectedGroupId: string;

  onGroupChange: (value: string) => void;

  onAssign: () => void;
  onPrint: () => void;
  onDelete: () => void;
};

export default function InventoryRecordBulkToolbar({
  selectedCount,
  groups,
  selectedGroupId,
  onGroupChange,
  onAssign,
  onPrint,
  onDelete,
}: Props) {
  if (!selectedCount) return null;

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { can } = usePermissions();

  const canDelete = can(PERMISSIONS.INVENTORY_DELETE);

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
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            {selectedCount} record
            {selectedCount !== 1 ? "s" : ""} selected
          </p>

          <p className="mt-0.5 text-xs text-emerald-700/70 dark:text-emerald-400/70">
            Apply an action to the selected inventory records.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FormSelect
            value={selectedGroupId}
            onChange={(event) => onGroupChange(event.target.value)}
            className="w-full sm:w-56"
          >
            <option value="">Assign group...</option>

            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.group_name}
              </option>
            ))}
          </FormSelect>

          <Button
            variant="secondary"
            disabled={!selectedGroupId}
            onClick={onAssign}
          >
            Apply
          </Button>

          <Button
            variant="secondary"
            onClick={onPrint}
            className="flex items-center gap-2"
          >
            <Printer size={16} />
            Print QR
          </Button>

          {canDelete && (
            <Button
              variant="danger"
              onClick={onDelete}
              className="flex items-center gap-2"
            >
              <Trash2 size={16} />
              Delete
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
