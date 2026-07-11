import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import DynamicField from "./DynamicField";

import type { InventoryRecord } from "../types";

import { useInventoryRecordForm } from "../hooks/useInventoryRecordForm";
import { Button } from "@/components/ui";
import { FormSelect } from "@/components/form";

type Props = {
  open: boolean;
  accountId: number;
  record?: InventoryRecord | null;
  onClose: () => void;
};

export default function InventoryRecordDialog({
  open,
  accountId,
  record,
  onClose,
}: Props) {
  const {
    columns,
    groups,

    control,

    groupId,
    setGroupId,

    onSubmit,

    isEdit,
    isSubmitting,
  } = useInventoryRecordForm({
    open,
    accountId,
    record,
    onSuccess: onClose,
  });

  if (!open) return null;

  return (
    <Dialog open={open} maxWidth="lg">
      <DialogHeader title={isEdit ? "Edit Record" : "Add Record"} />

      <form onSubmit={onSubmit}>
        <DialogBody>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Group</label>

            <FormSelect
              value={groupId ?? ""}
              onChange={(e) =>
                setGroupId(
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className="w-full rounded border p-2"
            >
              <option value="">No Group</option>

              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.group_name}
                </option>
              ))}
            </FormSelect>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {columns.map((column) => (
              <DynamicField key={column.id} column={column} control={control} />
            ))}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isEdit
              ? isSubmitting
                ? "Saving..."
                : "Save Changes"
              : isSubmitting
                ? "Creating..."
                : "Create"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
