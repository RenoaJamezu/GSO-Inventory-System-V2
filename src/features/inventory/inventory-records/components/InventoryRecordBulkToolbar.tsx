import { Printer, Trash2 } from "lucide-react";

import { FormSelect } from "@/components/form";
import { Button } from "@/components/ui";
import { PERMISSIONS, usePermissions } from "@/features/auth";

import type { Group } from "../types";

type Props = {
  selectedCount: number;
  groups: Group[];
  selectedGroupId: string;
  isAssigning?: boolean;
  isDeleting?: boolean;
  onGroupChange: (value: string) => void;
  onAssign: () => void;
  onPrint: () => void;
  onDelete: () => void;
};

export default function InventoryRecordBulkToolbar({
  selectedCount,
  groups,
  selectedGroupId,
  isAssigning = false,
  isDeleting = false,
  onGroupChange,
  onAssign,
  onPrint,
  onDelete,
}: Props) {
  const { can } = usePermissions();

  const canDelete = can(PERMISSIONS.INVENTORY_DELETE);
  const isPending = isAssigning || isDeleting;

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
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            {selectedCount} record{selectedCount !== 1 ? "s" : ""} selected
          </p>

          <p className="mt-0.5 text-xs text-emerald-700/70 dark:text-emerald-400/70">
            Apply an action to the selected inventory records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="min-w-44 flex-1 sm:flex-none">
            <FormSelect
              value={selectedGroupId}
              options={[
                {
                  value: "",
                  label: "No Group",
                },
                ...groups.map((group) => ({
                  value: String(group.id),
                  label: group.group_name,
                })),
              ]}
              onChange={onGroupChange}
              disabled={isPending}
            />
          </div>

          <Button
            variant="secondary"
            disabled={isPending}
            loading={isAssigning}
            onClick={onAssign}
            className="shrink-0 whitespace-nowrap"
          >
            Apply
          </Button>

          <Button
            variant="secondary"
            disabled={isPending}
            onClick={onPrint}
            className="shrink-0 whitespace-nowrap"
          >
            <Printer className="h-4 w-4 shrink-0" />
            Print QR
          </Button>

          {canDelete && (
            <Button
              variant="danger"
              disabled={isPending}
              loading={isDeleting}
              loadingText="Deleting..."
              onClick={onDelete}
              className="shrink-0 whitespace-nowrap"
            >
              <Trash2 className="h-4 w-4 shrink-0" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
