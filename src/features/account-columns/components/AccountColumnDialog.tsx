import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@/components/dialog";
import {
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
  FormCheckbox,
} from "@/components/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useCreateAccountColumn,
  useUpdateAccountColumn,
} from "../hooks/useAccountColumns";
import {
  type AccountColumnForm,
  accountColumnSchema,
} from "../schemas/accountColumn.schema";
import type {
  AccountColumn,
  ColumnDataType,
  AccountColumnInput,
} from "../types";

type Props = {
  open: boolean;
  accountId: number;
  column?: AccountColumn | null;
  onClose: () => void;
};

const DATA_TYPES: ColumnDataType[] = [
  "text",
  "textarea",
  "number",
  "date",
  "boolean",
];

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
      console.error(error);

      if (error instanceof Error) {
        alert(error.message);
        return;
      }

      alert("Failed to save column.");
    }
  }

  return (
    <Dialog open={open} maxWidth="md">
      <DialogHeader title={isEdit ? "Edit Column" : "Add Column"} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <FormField label="Label" required>
            <FormInput {...register("label")} />

            {errors.label && (
              <p className="mt-1 text-sm text-red-500">
                {errors.label.message}
              </p>
            )}
          </FormField>

          <FormField label="Data Type">
            <FormSelect {...register("data_type")}>
              {DATA_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </FormSelect>
          </FormField>

          <FormField label="Placeholder">
            <FormInput {...register("placeholder")} />
          </FormField>

          <FormField label="Description">
            <FormTextarea rows={3} {...register("description")} />
          </FormField>

          <div className="space-y-3">
            <FormCheckbox label="Required" {...register("is_required")} />

            <FormCheckbox
              label="Amount Column"
              {...register("is_amount_column")}
            />
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
            disabled={
              isSubmitting ||
              createMutation.isPending ||
              updateMutation.isPending
            }
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {isEdit ? "Save Changes" : "Create"}
          </button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
