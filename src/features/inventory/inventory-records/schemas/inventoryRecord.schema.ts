import { z, type ZodTypeAny } from "zod";

import type { AccountColumn } from "@/features/inventory/account-columns";

export function createInventoryRecordSchema(columns: AccountColumn[]) {
  const shape: Record<string, ZodTypeAny> = {};

  for (const column of columns) {
    let field: ZodTypeAny;

    switch (column.data_type) {
      case "number": {
        const numberSchema = column.is_required
          ? z.number({
              error: `${column.label} is required`,
            })
          : z.number().optional();

        field = z.preprocess((value) => {
          if (value === "" || value === null || value === undefined) {
            return undefined;
          }

          const number = Number(value);

          return Number.isFinite(number) ? number : undefined;
        }, numberSchema);

        break;
      }

      case "boolean":
        field = z.boolean();
        break;

      case "date":
      case "textarea":
      case "text":
      default:
        field = column.is_required
          ? z.string().trim().min(1, `${column.label} is required`)
          : z.string().optional();

        break;
    }

    shape[column.field_key] = field;
  }

  return z.object(shape);
}

export type InventoryRecordFormValues = z.infer<
  ReturnType<typeof createInventoryRecordSchema>
>;
