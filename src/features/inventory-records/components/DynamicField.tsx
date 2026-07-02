import { Controller, type Control } from "react-hook-form";

import {
  FormCheckbox,
  FormField,
  FormInput,
  FormTextarea,
} from "@/components/form";

import type { AccountColumn } from "@/features/account-columns";

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
                  placeholder={column.placeholder ?? ""}
                  value={field.value as number | string ?? ""}
                  onChange={(e) => {
                    const value = e.target.value;

                    field.onChange(value === "" ? undefined : Number(value));
                  }}
                />
              );

            case "date":
              return (
                <FormInput
                  type="date"
                  placeholder={column.placeholder ?? ""}
                  value={(field.value as string) ?? ""}
                  onChange={field.onChange}
                />
              );

            case "boolean":
              return (
                <FormCheckbox
                  checked={Boolean(field.value)}
                  onChange={(e) => field.onChange(e.target.checked)}
                  label=""
                />
              );

            case "textarea":
              return (
                <FormTextarea
                  rows={4}
                  placeholder={column.placeholder ?? ""}
                  value={(field.value as string) ?? ""}
                  onChange={field.onChange}
                />
              );

            case "text":
            default:
              return (
                <FormInput
                  type="text"
                  placeholder={column.placeholder ?? ""}
                  value={(field.value as string) ?? ""}
                  onChange={field.onChange}
                />
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
