import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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

  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEdit = Boolean(group);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<GroupFormValues>({
    resolver: zodResolver(groupSchema),
    defaultValues: {
      group_name: "",
      description: "",
    },
  });

  const loading =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      group_name: group?.group_name ?? "",
      description: group?.description ?? "",
    });
  }, [open, group, reset]);

  function handleClose() {
    if (loading) {
      return;
    }

    setSubmitError(null);
    onClose();
  }

  async function onSubmit(values: GroupFormValues) {
    setSubmitError(null);

    try {
      if (group) {
        await updateMutation.mutateAsync({
          id: group.id,
          account_id: accountId,
          values: {
            group_name: values.group_name,
            description: values.description,
          },
        });
      } else {
        await createMutation.mutateAsync({
          account_id: accountId,
          group_name: values.group_name,
          description: values.description,
          sort_order: 0,
        });
      }

      setSubmitError(null);
      onClose();
    } catch (error) {
      console.error("Failed saving inventory group", error);

      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to save inventory group.",
      );
    }
  }

  if (!open) {
    return null;
  }

  return (
    <Dialog
      open={open}
      maxWidth="md"
      onClose={loading ? undefined : handleClose}
    >
      <DialogHeader title={isEdit ? "Edit Group" : "Add Group"}>
        <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
          {isEdit
            ? "Update this inventory group's information."
            : "Create a group for organizing inventory records."}
        </p>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <DialogBody>
          {submitError && (
            <div
              role="alert"
              className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
            >
              {submitError}
            </div>
          )}

          <div className="space-y-4">
            <Controller
              name="group_name"
              control={control}
              render={({ field }) => (
                <FormField
                  label="Group Name"
                  required
                  error={errors.group_name?.message}
                >
                  <FormInput
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="Enter group name"
                    disabled={loading}
                  />
                </FormField>
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <FormField
                  label="Description"
                  error={errors.description?.message}
                >
                  <FormTextarea
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    rows={3}
                    placeholder="Optional group description"
                    disabled={loading}
                  />
                </FormField>
              )}
            />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
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
