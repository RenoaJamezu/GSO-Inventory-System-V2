import type { AccountColumn } from "@/features/inventory/account-columns";

import type { ColumnMapping } from "../types";

import { normalize } from "./normalize";

export function createAutoMapping(
  excelColumns: string[],
  systemColumns: AccountColumn[],
): ColumnMapping {
  const mapping: ColumnMapping = {};
  const usedFieldKeys = new Set<string>();

  for (const excelColumn of excelColumns) {
    const normalizedExcelColumn = normalize(excelColumn);

    const match = systemColumns.find(
      (column) =>
        normalize(column.label) === normalizedExcelColumn &&
        !usedFieldKeys.has(column.field_key),
    );

    if (!match) {
      continue;
    }

    mapping[excelColumn] = match.field_key;
    usedFieldKeys.add(match.field_key);
  }

  return mapping;
}
