import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { FormField, FormSelect } from "@/components/form";

import { Button } from "@/components/ui";

import DynamicField from "./DynamicField";

import type { InventoryRecord, InventoryType } from "../types";

import { useInventoryRecordForm } from "../hooks/useInventoryRecordForm";

type Props = {
  open: boolean;
  accountId: number;
  inventoryType: InventoryType;
  record?: InventoryRecord | null;
  onClose: () => void;
};

export default function InventoryRecordDialog({
  open,
  accountId,
  inventoryType,
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
    inventoryType,
    record,
    onSuccess: onClose,
  });

  if (!open) return null;

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={isSubmitting ? undefined : onClose}
    >
      <DialogHeader
        title={isEdit ? "Edit Inventory Record" : "Add Inventory Record"}
      >
        <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
          {isEdit
            ? "Update the information stored for this inventory record."
            : "Enter the information for a new inventory record."}
        </p>
      </DialogHeader>

      <form
        onSubmit={onSubmit}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <DialogBody>
          <div className="space-y-6">
            {/* Classification */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Record Classification
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Optionally assign this record to an inventory group.
                </p>
              </div>

              <FormField label="Group">
                <FormSelect
                  value={groupId ?? ""}
                  onChange={(event) =>
                    setGroupId(
                      event.target.value === ""
                        ? null
                        : Number(event.target.value),
                    )
                  }
                >
                  <option value="">No Group</option>

                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.group_name}
                    </option>
                  ))}
                </FormSelect>
              </FormField>
            </section>

            {/* Dynamic fields */}
            <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Record Information
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Complete the fields configured for this inventory account.
                </p>
              </div>

              {columns.length === 0 ? (
                <div className="rounded-md border border-dashed border-slate-300 px-4 py-8 text-center dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    No fields configured
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Configure account columns before adding inventory records.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {columns.map((column) => (
                    <DynamicField
                      key={column.id}
                      column={column}
                      control={control}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting || columns.length === 0}
          >
            {isEdit ? "Save Changes" : "Create Record"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
