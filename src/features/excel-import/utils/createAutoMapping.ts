import type { AccountColumn } from "@/features/account-columns";
import { normalize } from "./normalize";

export function createAutoMapping(
  excelColumns: string[],
  systemColumns: AccountColumn[],
) {
  const mapping: Record<string, string> = {};

  excelColumns.forEach((excelColumn) => {
    const match = systemColumns.find(
      (column) => normalize(column.label) === normalize(excelColumn),
    );

    if (match) {
      mapping[excelColumn] = match.field_key;
    }
  });

  return mapping;
}
