import { useEffect, useState } from "react";

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

import {
  useCreateAccountColumn,
  useUpdateAccountColumn,
} from "../hooks/useAccountColumns";

import type {
  AccountColumn,
  AccountColumnInput,
  ColumnDataType,
} from "../types";

type Props = {
  open: boolean;
  accountId: number;
  column?: AccountColumn | null;
  onClose: () => void;
};

const DATA_TYPES: ColumnDataType[] = ["text", "number", "date", "boolean"];

const createInitialForm = (accountId: number): AccountColumnInput => ({
  account_id: accountId,
  label: "",
  data_type: "text",
  placeholder: "",
  description: "",
  is_required: false,
  is_amount_column: false,
});

export default function AccountColumnDialog({
  open,
  accountId,
  column,
  onClose,
}: Props) {
  const createMutation = useCreateAccountColumn();
  const updateMutation = useUpdateAccountColumn();

  const [form, setForm] = useState<AccountColumnInput>(
    createInitialForm(accountId),
  );

  const isEdit = Boolean(column);

  useEffect(() => {
    if (!open) return;

    if (column) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        account_id: accountId,
        label: column.label,
        data_type: column.data_type,
        placeholder: column.placeholder ?? "",
        description: column.description ?? "",
        is_required: column.is_required,
        is_amount_column: column.is_amount_column,
      });

      return;
    }

    setForm(createInitialForm(accountId));
  }, [open, column, accountId]);

  const handleSubmit = async () => {
    if (!form.label.trim()) {
      alert("Label is required.");
      return;
    }

    try {
      if (isEdit && column) {
        await updateMutation.mutateAsync({
          id: column.id,
          values: form,
        });
      } else {
        await createMutation.mutateAsync(form);
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
  };

  return (
    <Dialog open={open} maxWidth="md">
      <DialogHeader title={isEdit ? "Edit Column" : "Add Column"} />

      <DialogBody>
        <FormField label="Label" required>
          <FormInput
            value={form.label}
            onChange={(e) =>
              setForm({
                ...form,
                label: e.target.value,
              })
            }
          />
        </FormField>

        <FormField label="Data Type">
          <FormSelect
            value={form.data_type}
            onChange={(e) =>
              setForm({
                ...form,
                data_type: e.target.value as ColumnDataType,
              })
            }
          >
            {DATA_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </FormSelect>
        </FormField>

        <FormField label="Placeholder">
          <FormInput
            value={form.placeholder ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                placeholder: e.target.value,
              })
            }
          />
        </FormField>

        <FormField label="Description">
          <FormTextarea
            rows={3}
            value={form.description ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />
        </FormField>

        <div className="space-y-3">
          <FormCheckbox
            label="Required"
            checked={form.is_required}
            onChange={(e) =>
              setForm({
                ...form,
                is_required: e.target.checked,
              })
            }
          />

          <FormCheckbox
            label="Amount Column"
            checked={form.is_amount_column}
            onChange={(e) =>
              setForm({
                ...form,
                is_amount_column: e.target.checked,
              })
            }
          />
        </div>
      </DialogBody>

      <DialogFooter>
        <button onClick={onClose} className="rounded border px-4 py-2">
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={createMutation.isPending || updateMutation.isPending}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isEdit ? "Save Changes" : "Create"}
        </button>
      </DialogFooter>
    </Dialog>
  );
}
