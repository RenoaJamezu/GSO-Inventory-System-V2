import { z, type ZodTypeAny } from "zod";

import type { AccountColumn } from "@/features/account-columns";

export function createInventoryRecordSchema(columns: AccountColumn[]) {
  const shape: Record<string, ZodTypeAny> = {};

  for (const column of columns) {
    let field: ZodTypeAny;

    switch (column.data_type) {
      case "number":
        field = z.preprocess((value) => {
          if (value === "" || value === null || value === undefined) {
            return undefined;
          }

          const number = Number(value);

          return Number.isNaN(number) ? undefined : number;
        }, z.number());

        break;

      case "boolean":
        field = z.boolean();

        break;

      case "date":
        field = z.string();

        break;

      case "textarea":
      case "text":
      default:
        field = z.string();
    }

    if (!column.is_required) {
      field = field.optional();
    }

    shape[column.field_key] = field;
  }

  return z.object(shape);
}

export type InventoryRecordFormValues = z.infer<
  ReturnType<typeof createInventoryRecordSchema>
>;
