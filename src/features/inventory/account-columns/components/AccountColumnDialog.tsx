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

import { zodResolver } from "@hookform/resolvers/zod";

import { CircleAlert, CircleDollarSign } from "lucide-react";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

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

export default function AccountColumnDialog({
  open,
  accountId,
  column,
  onClose,
}: Props) {
  const createMutation = useCreateAccountColumn();

  const updateMutation = useUpdateAccountColumn();

  const isEdit = Boolean(column);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AccountColumnForm>({
    resolver: zodResolver(accountColumnSchema),

    defaultValues: {
      label: "",
      data_type: "text",
      placeholder: "",
      description: "",
      is_required: false,
      is_amount_column: false,
    },
  });

  const loading =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) return;

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

    reset({
      label: "",
      data_type: "text",
      placeholder: "",
      description: "",
      is_required: false,
      is_amount_column: false,
    });
  }, [open, column, reset]);

  async function onSubmit(values: AccountColumnForm) {
    const payload: AccountColumnInput = {
      account_id: accountId,
      ...values,
    };

    try {
      if (isEdit && column) {
        await updateMutation.mutateAsync({
          id: column.id,
          values: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      onClose();
    } catch (error) {
      console.error("Failed saving account column", error);

      if (error instanceof Error) {
        alert(error.message);
        return;
      }

      alert("Failed to save column.");
    }
  }

  return (
    <Dialog open={open} maxWidth="lg" onClose={loading ? undefined : onClose}>
      <DialogHeader title={isEdit ? "Edit Column" : "Add Column"}>
        <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
          {isEdit
            ? "Update the configuration of this inventory field."
            : "Create a field that will appear on inventory records."}
        </p>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="space-y-6">
            {/* General information */}
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

              <FormField label="Column Label" required>
                <FormInput
                  placeholder="Example: Serial Number"
                  {...register("label")}
                />

                {errors.label && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.label.message}
                  </p>
                )}
              </FormField>

              <FormField label="Input Type">
                <FormSelect {...register("data_type")}>
                  {DATA_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </FormSelect>
              </FormField>

              <FormField label="Placeholder Text">
                <FormInput
                  placeholder="Example: Enter serial number..."
                  {...register("placeholder")}
                />
              </FormField>

              <FormField label="Help Text">
                <FormTextarea
                  rows={3}
                  placeholder="Optional instructions shown to users..."
                  {...register("description")}
                />
              </FormField>
            </section>

            {/* Options */}
            <section
              className="
                space-y-4
                border-t
                border-slate-200
                pt-6
                dark:border-slate-800
              "
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Field Options
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Configure validation and reporting behavior.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <FormCheckbox
                  icon={<CircleAlert size={18} />}
                  label="Required Field"
                  description="Users must provide a value before saving a record."
                  {...register("is_required")}
                />

                <FormCheckbox
                  icon={<CircleDollarSign size={18} />}
                  label="Amount Column"
                  description="Used for inventory totals and reports. Only one amount column can be active."
                  {...register("is_amount_column")}
                />
              </div>
            </section>
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
            {isEdit ? "Save Changes" : "Create Column"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
