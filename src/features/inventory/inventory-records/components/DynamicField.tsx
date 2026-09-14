import {
  FormCheckbox,
  FormField,
  FormInput,
  FormTextarea,
} from "@/components/form";

import type { AccountColumn } from "@/features/inventory/account-columns";

import { type Control, Controller } from "react-hook-form";

type Props = {
  column: AccountColumn;
  control: Control<Record<string, unknown>>;
};

export default function DynamicField({ column, control }: Props) {
  return (
    <FormField label={column.label} required={column.is_required}>
      <Controller
        name={column.field_key}
        control={control}
        defaultValue={getDefaultValue(column.data_type)}
        render={({ field }) => {
          switch (column.data_type) {
            case "number":
              return (
                <FormInput
                  type="number"
                  step="any"
                  placeholder={column.placeholder ?? ""}
                  value={(field.value as number | string) ?? ""}
                  onChange={(event) => {
                    const value = event.target.value;

                    field.onChange(value === "" ? undefined : Number(value));
                  }}
                />
              );

            case "date":
              return (
                <FormInput
                  type="date"
                  value={(field.value as string) ?? ""}
                  onChange={field.onChange}
                />
              );

            case "boolean":
              return (
                <FormCheckbox
                  checked={Boolean(field.value)}
                  onChange={(event) => field.onChange(event.target.checked)}
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
                    value={(field.value as string) ?? ""}
                    onChange={field.onChange}
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
                    value={(field.value as string) ?? ""}
                    onChange={field.onChange}
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

function getDefaultValue(type: string) {
  switch (type) {
    case "number":
      return undefined;

    case "boolean":
      return false;

    default:
      return "";
  }
}
