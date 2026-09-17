import { useMemo, useState } from "react";

import { Dialog, DialogFooter, DialogHeader } from "@/components/dialog";
import { FormField, FormInput, FormSelect } from "@/components/form";
import { Button } from "@/components/ui";

import type { InventoryTableColumn } from "../../inventory-records/table-layout";
import {
  useCreateAccountColumnGroup,
  useUpdateAccountColumnGroup,
} from "../hooks/useTableMerges";
import type { AccountColumnGroup } from "../types";
import { validateHeaderGroup } from "../utils";

interface Props {
  open: boolean;
  onClose: () => void;
  accountId: number;
  columns: InventoryTableColumn[];
  groups: AccountColumnGroup[];
  editingGroup?: AccountColumnGroup | null;
}

export default function HeaderGroupDialog({
  open,
  onClose,
  accountId,
  columns,
  groups,
  editingGroup = null,
}: Props) {
  const createGroup = useCreateAccountColumnGroup();
  const updateGroup = useUpdateAccountColumnGroup();

  const [label, setLabel] = useState(editingGroup?.label ?? "");
  const [startColumnId, setStartColumnId] = useState(
    editingGroup ? String(editingGroup.start_column_id) : "",
  );
  const [endColumnId, setEndColumnId] = useState(
    editingGroup ? String(editingGroup.end_column_id) : "",
  );
  const [error, setError] = useState<string | null>(null);

  const isEditing = editingGroup !== null;
  const isPending = createGroup.isPending || updateGroup.isPending;

  const orderedColumns = useMemo(
    () =>
      [...columns].sort(
        (first, second) =>
          first.displayOrder - second.displayOrder || first.id - second.id,
      ),
    [columns],
  );

  const columnOptions = useMemo(
    () =>
      orderedColumns.map((column) => ({
        value: String(column.id),
        label: column.label,
      })),
    [orderedColumns],
  );

  function handleClose() {
    if (isPending) {
      return;
    }

    setError(null);
    onClose();
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!startColumnId || !endColumnId) {
      setError("Select both the start and end columns.");
      return;
    }

    const values = {
      account_id: accountId,
      label: label.trim(),
      start_column_id: Number(startColumnId),
      end_column_id: Number(endColumnId),
    };

    const validation = validateHeaderGroup({
      group: values,
      columns: orderedColumns,
      existingGroups: groups,
      excludeGroupId: editingGroup?.id,
    });

    if (!validation.valid) {
      setError(validation.errors[0]?.message ?? "Invalid header group.");
      return;
    }

    try {
      if (editingGroup) {
        await updateGroup.mutateAsync({
          id: editingGroup.id,
          values,
        });
      } else {
        await createGroup.mutateAsync(values);
      }

      onClose();
    } catch (mutationError) {
      console.error("Failed saving header group", mutationError);

      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Failed to save header group.",
      );
    }
  }

  return (
    <Dialog
      open={open}
      onClose={isPending ? undefined : handleClose}
      maxWidth="md"
    >
      <DialogHeader
        title={isEditing ? "Edit Header Group" : "Create Header Group"}
        description="Group two or more consecutive inventory columns under a shared table header."
      />

      <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
        {error && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
          >
            {error}
          </div>
        )}

        <FormField label="Header Label" required>
          <FormInput
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="e.g. Acquisition Information"
            disabled={isPending}
          />
        </FormField>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Start Column" required>
            <FormSelect
              value={startColumnId}
              options={columnOptions}
              placeholder="Select column"
              onChange={setStartColumnId}
              disabled={isPending}
            />
          </FormField>

          <FormField label="End Column" required>
            <FormSelect
              value={endColumnId}
              options={columnOptions}
              placeholder="Select column"
              onChange={setEndColumnId}
              disabled={isPending}
            />
          </FormField>
        </div>

        <DialogFooter className="-mx-5 -mb-5 mt-6 sm:-mx-6 sm:-mb-6">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button type="submit" loading={isPending}>
            {isEditing ? "Save Changes" : "Create Group"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
