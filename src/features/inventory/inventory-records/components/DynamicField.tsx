import { type Control, Controller } from "react-hook-form";

import type { AccountColumn } from "@/features/inventory/account-columns";
import {
  FormCheckbox,
  FormField,
  FormInput,
  FormNumberInput,
  FormTextarea,
} from "@/components/form";

type Props = {
  column: AccountColumn;
  control: Control<Record<string, unknown>>;
  error?: string;
};

export default function DynamicField({ column, control, error }: Props) {
  return (
    <FormField label={column.label} required={column.is_required} error={error}>
      <Controller
        name={column.field_key}
        control={control}
        render={({ field }) => {
          switch (column.data_type) {
            case "number":
              if (column.is_amount_column) {
                return (
                  <FormNumberInput
                    value={
                      typeof field.value === "number" ? field.value : undefined
                    }
                    placeholder={column.placeholder ?? ""}
                    useGrouping
                    maximumFractionDigits={2}
                    onValueChange={field.onChange}
                    onBlur={field.onBlur}
                  />
                );
              }

              return (
                <FormInput
                  type="number"
                  step="any"
                  placeholder={column.placeholder ?? ""}
                  value={
                    typeof field.value === "number" ||
                    typeof field.value === "string"
                      ? field.value
                      : ""
                  }
                  onChange={(event) => {
                    const value = event.target.value;

                    field.onChange(value === "" ? undefined : Number(value));
                  }}
                  onBlur={field.onBlur}
                />
              );

            case "date":
              return (
                <FormInput
                  type="date"
                  value={typeof field.value === "string" ? field.value : ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              );

            case "boolean":
              return (
                <FormCheckbox
                  checked={field.value === true}
                  onChange={(event) => field.onChange(event.target.checked)}
                  onBlur={field.onBlur}
                  label={column.placeholder || "Yes"}
                  description={column.description ?? undefined}
                />
              );

            case "textarea":
              return (
                <>
                  <FormTextarea
                    rows={4}
                    placeholder={column.placeholder ?? ""}
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />

                  {column.description && (
                    <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {column.description}
                    </p>
                  )}
                </>
              );

            case "text":
            default:
              return (
                <>
                  <FormInput
                    type="text"
                    placeholder={column.placeholder ?? ""}
                    value={typeof field.value === "string" ? field.value : ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                  />

                  {column.description && (
                    <p className="text-xs leading-5 text-slate-500 dark:text-slate-400">
                      {column.description}
                    </p>
                  )}
                </>
              );
          }
        }}
      />
    </FormField>
  );
}
