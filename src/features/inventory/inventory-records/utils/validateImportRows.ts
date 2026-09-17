import type { AccountColumn } from "@/features/inventory/account-columns";

import type { ColumnMapping, PreviewRow } from "../types";

export type ImportValidationResult =
  | {
      isValid: true;
      rows: PreviewRow[];
    }
  | {
      isValid: false;
      message: string;
    };

function isEmptyValue(value: unknown): boolean {
  return (
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "")
  );
}

function isEmptyRow(row: PreviewRow): boolean {
  return !Object.values(row.data).some((value) => !isEmptyValue(value));
}

function isValidNumber(value: unknown): boolean {
  if (typeof value === "number") {
    return Number.isFinite(value);
  }

  const cleaned = String(value).replace(/₱/g, "").replace(/,/g, "").trim();

  if (!cleaned) {
    return false;
  }

  return Number.isFinite(Number(cleaned));
}

function isValidBoolean(value: unknown): boolean {
  if (typeof value === "boolean") {
    return true;
  }

  const normalized = String(value).trim().toLowerCase();

  return ["true", "false", "yes", "no", "y", "n", "1", "0"].includes(
    normalized,
  );
}

export function validateImportRows(
  rows: PreviewRow[],
  mapping: ColumnMapping,
  columns: AccountColumn[],
  headerRow: number,
): ImportValidationResult {
  const mappedFields = Object.values(mapping).filter(Boolean);

  if (mappedFields.length === 0) {
    return {
      isValid: false,
      message: "Map at least one Excel column before importing.",
    };
  }

  const uniqueMappedFields = new Set(mappedFields);

  if (uniqueMappedFields.size !== mappedFields.length) {
    return {
      isValid: false,
      message:
        "Each system field can only be mapped once. Please remove duplicate column mappings.",
    };
  }

  const requiredColumns = columns.filter((column) => column.is_required);

  const unmappedRequiredColumns = requiredColumns.filter(
    (column) => !uniqueMappedFields.has(column.field_key),
  );

  if (unmappedRequiredColumns.length > 0) {
    const labels = unmappedRequiredColumns
      .map((column) => column.label)
      .join(", ");

    return {
      isValid: false,
      message: `Map all required fields before importing: ${labels}`,
    };
  }

  const nonEmptyRows = rows
    .map((row, index) => ({
      row,
      excelRowNumber: headerRow + index + 1,
    }))
    .filter(({ row }) => !isEmptyRow(row));

  if (nonEmptyRows.length === 0) {
    return {
      isValid: false,
      message: "There are no records to import.",
    };
  }

  const excelColumnByFieldKey = new Map<string, string>();

  Object.entries(mapping).forEach(([excelColumn, fieldKey]) => {
    if (fieldKey) {
      excelColumnByFieldKey.set(fieldKey, excelColumn);
    }
  });

  for (const { row, excelRowNumber } of nonEmptyRows) {
    for (const column of requiredColumns) {
      const excelColumn = excelColumnByFieldKey.get(column.field_key);

      if (!excelColumn) {
        continue;
      }

      const value = row.data[excelColumn];

      if (isEmptyValue(value)) {
        return {
          isValid: false,
          message: `Excel row ${excelRowNumber} is missing required fields: ${column.label}`,
        };
      }
    }

    for (const [excelColumn, fieldKey] of Object.entries(mapping)) {
      if (!fieldKey) {
        continue;
      }

      const column = columns.find(
        (candidate) => candidate.field_key === fieldKey,
      );

      if (!column) {
        continue;
      }

      const value = row.data[excelColumn];

      if (isEmptyValue(value)) {
        continue;
      }

      if (column.data_type === "number" && !isValidNumber(value)) {
        return {
          isValid: false,
          message: `Excel row ${excelRowNumber}, ${column.label}: "${String(
            value,
          )}" is not a valid number.`,
        };
      }

      if (column.data_type === "boolean" && !isValidBoolean(value)) {
        return {
          isValid: false,
          message: `Excel row ${excelRowNumber}, ${column.label}: "${String(
            value,
          )}" is not a valid boolean value.`,
        };
      }
    }
  }

  return {
    isValid: true,
    rows: nonEmptyRows.map(({ row }) => row),
  };
}
