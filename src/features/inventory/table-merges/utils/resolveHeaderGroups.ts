import type { InventoryTableColumn } from "../../inventory-records/table-layout";

import type { AccountColumnGroup } from "../types";

import { resolveColumnRange } from "./resolveColumnRange";

export interface ResolvedHeaderGroup {
  id: number;
  label: string;

  startColumnId: number;
  endColumnId: number;

  columns: InventoryTableColumn[];

  startColumnIndex: number;
  endColumnIndex: number;

  colSpan: number;

  source: AccountColumnGroup;
}

interface ResolveHeaderGroupsParams {
  columns: InventoryTableColumn[];
  groups: AccountColumnGroup[];
}

export function resolveHeaderGroups({
  columns,
  groups,
}: ResolveHeaderGroupsParams): ResolvedHeaderGroup[] {
  const resolved: ResolvedHeaderGroup[] = [];
  const occupiedColumnIds = new Set<number>();

  for (const group of groups) {
    const resolvedColumns = resolveColumnRange({
      columns,
      startColumnId: group.start_column_id,
      endColumnId: group.end_column_id,
    });

    if (resolvedColumns.length < 2) {
      continue;
    }

    const hasOverlap = resolvedColumns.some((column) =>
      occupiedColumnIds.has(column.id),
    );

    if (hasOverlap) {
      continue;
    }

    const startColumnIndex = columns.findIndex(
      (column) => column.id === resolvedColumns[0].id,
    );

    const endColumnIndex = columns.findIndex(
      (column) => column.id === resolvedColumns[resolvedColumns.length - 1].id,
    );

    if (startColumnIndex === -1 || endColumnIndex === -1) {
      continue;
    }

    resolvedColumns.forEach((column) => {
      occupiedColumnIds.add(column.id);
    });

    resolved.push({
      id: group.id,
      label: group.label,

      startColumnId: resolvedColumns[0].id,
      endColumnId: resolvedColumns[resolvedColumns.length - 1].id,

      columns: resolvedColumns,

      startColumnIndex,
      endColumnIndex,

      colSpan: resolvedColumns.length,

      source: group,
    });
  }

  return resolved;
}
