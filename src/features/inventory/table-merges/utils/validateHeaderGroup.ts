import type { InventoryTableColumn } from "../../inventory-records/table-layout";

import type { AccountColumnGroup, AccountColumnGroupInput } from "../types";

import { resolveColumnRange } from "./resolveColumnRange";

export type HeaderGroupValidationCode =
  | "EMPTY_LABEL"
  | "MISSING_COLUMN"
  | "INVALID_RANGE"
  | "SINGLE_COLUMN"
  | "OVERLAP";

export interface HeaderGroupValidationError {
  code: HeaderGroupValidationCode;
  message: string;
}

export interface HeaderGroupValidationResult {
  valid: boolean;
  errors: HeaderGroupValidationError[];
}

interface ValidateHeaderGroupParams {
  group: AccountColumnGroupInput;
  columns: InventoryTableColumn[];
  existingGroups?: AccountColumnGroup[];
  excludeGroupId?: number;
}

export function validateHeaderGroup({
  group,
  columns,
  existingGroups = [],
  excludeGroupId,
}: ValidateHeaderGroupParams): HeaderGroupValidationResult {
  const errors: HeaderGroupValidationError[] = [];

  if (!group.label.trim()) {
    errors.push({
      code: "EMPTY_LABEL",
      message: "Header group label is required.",
    });
  }

  const startIndex = columns.findIndex(
    (column) => column.id === group.start_column_id,
  );
  const endIndex = columns.findIndex(
    (column) => column.id === group.end_column_id,
  );

  if (startIndex === -1 || endIndex === -1) {
    errors.push({
      code: "MISSING_COLUMN",
      message: "One or more selected columns no longer exist.",
    });

    return {
      valid: false,
      errors,
    };
  }

  if (startIndex > endIndex) {
    errors.push({
      code: "INVALID_RANGE",
      message: "The end column must come after the start column.",
    });

    return {
      valid: false,
      errors,
    };
  }

  const resolvedColumns = resolveColumnRange({
    columns,
    startColumnId: group.start_column_id,
    endColumnId: group.end_column_id,
  });

  if (resolvedColumns.length < 2) {
    errors.push({
      code: "SINGLE_COLUMN",
      message: "A header group must contain at least two columns.",
    });
  }

  if (resolvedColumns.length >= 2) {
    const selectedColumnIds = new Set(
      resolvedColumns.map((column) => column.id),
    );

    const hasOverlap = existingGroups.some((existingGroup) => {
      if (existingGroup.id === excludeGroupId) {
        return false;
      }

      const existingColumns = resolveColumnRange({
        columns,
        startColumnId: existingGroup.start_column_id,
        endColumnId: existingGroup.end_column_id,
      });

      return existingColumns.some((column) => selectedColumnIds.has(column.id));
    });

    if (hasOverlap) {
      errors.push({
        code: "OVERLAP",
        message: "This header group overlaps an existing header group.",
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
