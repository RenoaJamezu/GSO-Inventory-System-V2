import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@/components/dialog";

import { FormField, FormInput, FormTextarea } from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { type GroupFormValues, groupSchema } from "../../schemas/groupSchema";
import type { Group } from "../../types";
import { useCreateGroup, useUpdateGroup } from "../../hooks/useInventoryRecordGroups";

type Props = {
  open: boolean;
  accountId: number;
  group?: Group | null;
  onClose: () => void;
};

export default function InventoryGroupDialog({
  open,
  accountId,
  group,
  onClose,
}: Props) {
  const createMutation = useCreateGroup();
  const updateMutation = useUpdateGroup();

  const isEdit = Boolean(group);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      account_id: accountId,
      group_name: "",
      description: "",
      sort_order: 0,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (group) {
      reset({
        account_id: group.account_id,
        group_name: group.group_name,
        description: group.description ?? "",
        sort_order: group.sort_order,
      });

      return;
    }

    reset({
      account_id: accountId,
      group_name: "",
      description: "",
      sort_order: 0,
    });
  }, [open, group, accountId, reset]);

  async function onSubmit(values: GroupFormValues) {
    try {
      if (isEdit && group) {
        await updateMutation.mutateAsync({
          id: group.id,
          values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }

      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to save group.");
    }
  }

  if (!open) return null;

  return (
    <Dialog open={open} maxWidth="md">
      <DialogHeader title={isEdit ? "Edit Group" : "Add Group"} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="space-y-4">
            <FormField label="Group Name" required>
              <FormInput {...register("group_name")} />
            </FormField>

            <FormField label="Description">
              <FormTextarea rows={3} {...register("description")} />
            </FormField>

            <FormField label="Sort Order">
              <FormInput
                type="number"
                {...register("sort_order", {
                  valueAsNumber: true,
                })}
              />
            </FormField>

            <input
              type="hidden"
              {...register("account_id", {
                valueAsNumber: true,
              })}
            />

            {errors.group_name && (
              <p className="text-sm text-red-500">
                {errors.group_name.message}
              </p>
            )}

            {errors.sort_order && (
              <p className="text-sm text-red-500">
                {errors.sort_order.message}
              </p>
            )}
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
