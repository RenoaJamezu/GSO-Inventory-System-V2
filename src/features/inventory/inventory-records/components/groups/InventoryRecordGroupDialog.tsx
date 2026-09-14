import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { FormField, FormInput, FormTextarea } from "@/components/form";

import { Button } from "@/components/ui";

import { type GroupFormValues, groupSchema } from "../../schemas/groupSchema";

import type { Group } from "../../types";

import {
  useCreateGroup,
  useUpdateGroup,
} from "../../hooks/useInventoryRecordGroups";

type Props = {
  open: boolean;
  accountId: number;
  group?: Group | null;
  onClose: () => void;
};

export default function InventoryRecordGroupDialog({
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
    formState: { errors, isSubmitting },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),

    defaultValues: {
      account_id: accountId,
      group_name: "",
      description: "",
      sort_order: 0,
    },
  });

  const loading =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

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
      console.error("Failed saving inventory group", error);
    }
  }

  if (!open) return null;

  return (
    <Dialog open={open} maxWidth="md" onClose={loading ? undefined : onClose}>
      <DialogHeader title={isEdit ? "Edit Group" : "Add Group"}>
        <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
          {isEdit
            ? "Update how this inventory group is identified and ordered."
            : "Create a group for organizing inventory records."}
        </p>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="space-y-4">
            <FormField label="Group Name" required>
              <FormInput
                {...register("group_name")}
                placeholder="Enter group name"
              />

              {errors.group_name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.group_name.message}
                </p>
              )}
            </FormField>

            <FormField label="Description">
              <FormTextarea
                rows={3}
                {...register("description")}
                placeholder="Optional group description"
              />

              {errors.description && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.description.message}
                </p>
              )}
            </FormField>

            <FormField label="Sort Order">
              <FormInput
                type="number"
                min="0"
                {...register("sort_order", {
                  valueAsNumber: true,
                })}
              />

              {errors.sort_order && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.sort_order.message}
                </p>
              )}
            </FormField>

            <input
              type="hidden"
              {...register("account_id", {
                valueAsNumber: true,
              })}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button type="submit" loading={loading}>
            {isEdit ? "Save Changes" : "Create Group"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
