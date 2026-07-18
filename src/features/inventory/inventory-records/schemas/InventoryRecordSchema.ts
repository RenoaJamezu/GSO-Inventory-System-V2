import { z, type ZodTypeAny } from "zod";
import type { AccountColumn } from "@/features/inventory/account-columns";

export function createInventoryRecordSchema(columns: AccountColumn[]) {
  const shape: Record<string, ZodTypeAny> = {};

  for (const column of columns) {
    let field: ZodTypeAny;

    switch (column.data_type) {
      case "number":
        field = z.preprocess((value) => {
          if (value === "" || value === null || value === undefined) {
            return 0;
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

    if (column.is_required) {
      field = field.refine(
        (value) => value !== undefined && value !== "",
        `${column.label} is required`,
      );
    } else {
      field = field.optional();
    }

    shape[column.field_key] = field;
  }

  return z.object(shape);
}

export type InventoryRecordFormValues = z.infer<
  ReturnType<typeof createInventoryRecordSchema>
>;
