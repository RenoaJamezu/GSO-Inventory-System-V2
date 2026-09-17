import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert, CircleDollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";
import {
  FormCheckbox,
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/form";
import { Button } from "@/components/ui";

import { DATA_TYPES } from "../constants";
import {
  useCreateAccountColumn,
  useUpdateAccountColumn,
} from "../hooks/useAccountColumns";
import {
  accountColumnSchema,
  type AccountColumnForm,
} from "../schemas/accountColumn.schema";
import type { AccountColumn, AccountColumnInput } from "../types";

type Props = {
  open: boolean;
  accountId: number;
  column?: AccountColumn | null;
  onClose: () => void;
};

const DEFAULT_VALUES: AccountColumnForm = {
  label: "",
  data_type: "text",
  placeholder: "",
  description: "",
  is_required: false,
  is_amount_column: false,
};

export default function AccountColumnDialog({
  open,
  accountId,
  column,
  onClose,
}: Props) {
  const createMutation = useCreateAccountColumn();
  const updateMutation = useUpdateAccountColumn();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = Boolean(column);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountColumnForm>({
    resolver: zodResolver(accountColumnSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const loading =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (column) {
      reset({
        label: column.label,
        data_type: column.data_type,
        placeholder: column.placeholder ?? "",
        description: column.description ?? "",
        is_required: column.is_required,
        is_amount_column: column.is_amount_column,
      });

      return;
    }

    reset(DEFAULT_VALUES);
  }, [open, column, reset]);

  function handleClose() {
    if (loading) {
      return;
    }

    setSubmitError(null);
    reset(DEFAULT_VALUES);
    onClose();
  }

  async function onSubmit(values: AccountColumnForm) {
    setSubmitError(null);

    const payload: AccountColumnInput = {
      account_id: accountId,
      ...values,
    };

    try {
      if (column) {
        await updateMutation.mutateAsync({
          id: column.id,
          values: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      reset(DEFAULT_VALUES);
      onClose();
    } catch (error) {
      console.error("Failed saving account column", error);

      setSubmitError(
        error instanceof Error ? error.message : "Failed to save column.",
      );
    }
  }

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={loading ? undefined : handleClose}
    >
      <DialogHeader title={isEditing ? "Edit Column" : "Add Column"}>
        <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
          {isEditing
            ? "Update the configuration of this inventory field."
            : "Create a field that will appear on inventory records."}
        </p>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <DialogBody>
          <div className="space-y-6">
            {submitError && (
              <div
                role="alert"
                className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-300"
              >
                {submitError}
              </div>
            )}

            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  General Information
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Configure how this field appears when working with inventory
                  records.
                </p>
              </div>

              <Controller
                name="label"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Column Label"
                    required
                    error={errors.label?.message}
                  >
                    <FormInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Example: Serial Number"
                    />
                  </FormField>
                )}
              />

              <FormField label="Input Type" error={errors.data_type?.message}>
                <Controller
                  name="data_type"
                  control={control}
                  render={({ field }) => (
                    <FormSelect
                      value={field.value}
                      options={DATA_TYPES}
                      onChange={field.onChange}
                    />
                  )}
                />
              </FormField>

              <Controller
                name="placeholder"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Placeholder Text"
                    error={errors.placeholder?.message}
                  >
                    <FormInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Example: Enter serial number..."
                    />
                  </FormField>
                )}
              />

              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <FormField
                    label="Help Text"
                    error={errors.description?.message}
                  >
                    <FormTextarea
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      rows={3}
                      placeholder="Optional instructions shown to users..."
                    />
                  </FormField>
                )}
              />
            </section>

            <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Field Options
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Configure validation and reporting behavior.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Controller
                  name="is_required"
                  control={control}
                  render={({ field }) => (
                    <FormCheckbox
                      name={field.name}
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      onBlur={field.onBlur}
                      icon={<CircleAlert size={18} />}
                      label="Required Field"
                      description="Users must provide a value before saving a record."
                    />
                  )}
                />

                <Controller
                  name="is_amount_column"
                  control={control}
                  render={({ field }) => (
                    <FormCheckbox
                      name={field.name}
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      onBlur={field.onBlur}
                      icon={<CircleDollarSign size={18} />}
                      label="Amount Column"
                      description="Used for inventory totals and reports. Only one amount column can be active."
                    />
                  )}
                />
              </div>
            </section>
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
            {isEditing ? "Save Changes" : "Create Column"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
