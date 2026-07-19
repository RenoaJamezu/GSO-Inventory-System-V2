import { FormSelect } from "@/components/form";
import { Button } from "@/components/ui";
import type { Group } from "../types";

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

  return (
    <section className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="font-medium text-emerald-700">
          {selectedCount} record{selectedCount > 1 ? "s" : ""} selected
        </div>

        <div className="flex gap-2 items-center w-2/3 justify-end">
          <FormSelect
            value={selectedGroupId}
            onChange={(e) => onGroupChange(e.target.value)}
            className="max-w-56"
          >
            <option value="" className="text-sm">
              Assign Group...
            </option>

            {groups.map((group) => (
              <option key={group.id} value={group.id} className="text-sm">
                {group.group_name}
              </option>
            ))}
          </FormSelect>

          <Button disabled={!selectedGroupId} onClick={onAssign}>
            Apply
          </Button>

          <Button variant="success" onClick={onPrint}>
            Print QR
          </Button>

          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </div>
    </section>
  );
}
