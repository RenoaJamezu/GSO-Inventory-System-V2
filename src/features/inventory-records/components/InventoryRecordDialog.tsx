import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import DynamicField from "./DynamicField";

import { useAccountColumns } from "@/features/account-columns";
import { useGroups } from "@/features/groups";

import {
  useCreateInventoryRecord,
  useUpdateInventoryRecord,
} from "../hooks/useInventoryRecords";

import type { InventoryRecord } from "../types";
import {
  createInventoryRecordSchema,
  type InventoryRecordFormValues,
} from "../schemas/InventoryRecordSchema";

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
  const { data: columns = [], isLoading } = useAccountColumns(accountId);

  const { data: groups = [] } = useGroups(accountId);

  const schema = useMemo(() => createInventoryRecordSchema(columns), [columns]);

  const createMutation = useCreateInventoryRecord();
  const updateMutation = useUpdateInventoryRecord();

  const isEdit = Boolean(record);

  const [groupId, setGroupId] = useState<number | null>(null);

  const { control, handleSubmit, reset } = useForm<InventoryRecordFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (!open) return;

    // wait until columns are ready
    if (!columns.length) return;

    if (record) {
      reset({
        ...Object.fromEntries(
          columns.map((col) => [
            col.field_key,
            record.data?.[col.field_key] ?? "",
          ]),
        ),
      });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGroupId(record.group_id ?? null);

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const values: any = {
      group_id: null,
    };

    columns.forEach((column) => {
      switch (column.data_type) {
        case "boolean":
          values[column.field_key] = false;
          break;
        default:
          values[column.field_key] = "";
      }
    });

    reset(values);
    setGroupId(null);
  }, [open, record, columns, reset]);

  const onSubmit = async (values: InventoryRecordFormValues) => {
    try {
      if (isEdit && record) {
        await updateMutation.mutateAsync({
          id: record.id,
          values: {
            group_id: groupId,
            data: values,
          },
        });
      } else {
        await createMutation.mutateAsync({
          account_id: accountId,
          group_id: groupId,
          data: values,
        });
      }

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save record.");
    }
  };

  console.log("InventoryRecordDialog record:", record);

  if (!open) return null;

  if (isLoading) {
    return (
      <Dialog open={open} maxWidth="lg">
        <DialogBody>
          <div className="py-8 text-center">Loading...</div>
        </DialogBody>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} maxWidth="lg">
      <DialogHeader title={isEdit ? "Edit Record" : "Add Record"} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium">Group</label>

            <select
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
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {columns.map((column) => (
              <DynamicField key={column.id} column={column} control={control} />
            ))}
          </div>
        </DialogBody>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            className="rounded border px-4 py-2"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isEdit
              ? updateMutation.isPending
                ? "Saving..."
                : "Save Changes"
              : createMutation.isPending
                ? "Creating..."
                : "Create"}
          </button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
