import type { AccountColumn } from "../../account-columns";
import type { AccountColumnGroup } from "../../table-merges";

import { resolveHeaderGroups } from "../../table-merges";

import type { Group, InventoryRecord } from "../types";

import type {
  InventoryTableColumn,
  InventoryTableGroup,
  InventoryTableLayout,
  InventoryTableRow,
} from "./types";

interface BuildInventoryTableLayoutParams {
  columns: AccountColumn[];
  records: InventoryRecord[];
  groups: Group[];
  columnGroups?: AccountColumnGroup[];
}

function buildColumns(columns: AccountColumn[]): InventoryTableColumn[] {
  return [...columns]
    .sort((a, b) => a.display_order - b.display_order || a.id - b.id)
    .map((column) => ({
      id: column.id,
      fieldKey: column.field_key,
      label: column.label,
      dataType: column.data_type,
      displayOrder: column.display_order,
      isAmountColumn: column.is_amount_column,
      source: column,
    }));
}

function buildRows(
  records: InventoryRecord[],
  columns: InventoryTableColumn[],
): InventoryTableRow[] {
  return [...records]
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id)
    .map((record, index) => ({
      id: record.id,
      record,
      rowNumber: index + 1,
      groupId: record.group_id,

      cells: columns.map((column) => ({
        columnId: column.id,
        fieldKey: column.fieldKey,
        dataType: column.dataType,
        isAmountColumn: column.isAmountColumn,
        value: record.data[column.fieldKey],
      })),
    }));
}

function buildGroups(
  rows: InventoryTableRow[],
  groups: Group[],
): InventoryTableGroup[] {
  const rowsByGroup = new Map<number | null, InventoryTableRow[]>();

  for (const row of rows) {
    const groupRows = rowsByGroup.get(row.groupId) ?? [];

    groupRows.push(row);
    rowsByGroup.set(row.groupId, groupRows);
  }

  const resolvedGroups: InventoryTableGroup[] = [];

  const noGroupRows = rowsByGroup.get(null) ?? [];

  if (noGroupRows.length > 0) {
    resolvedGroups.push({
      id: null,
      name: "No Group",
      sortOrder: -1,
      rows: noGroupRows,
      source: null,
    });
  }

  const sortedGroups = [...groups].sort(
    (a, b) => a.sort_order - b.sort_order || a.id - b.id,
  );

  for (const group of sortedGroups) {
    const groupRows = rowsByGroup.get(group.id) ?? [];

    if (groupRows.length === 0) {
      continue;
    }

    resolvedGroups.push({
      id: group.id,
      name: group.group_name,
      sortOrder: group.sort_order,
      rows: groupRows,
      source: group,
    });
  }

  return resolvedGroups;
}

export function buildInventoryTableLayout({
  columns,
  records,
  groups,
  columnGroups = [],
}: BuildInventoryTableLayoutParams): InventoryTableLayout {
  const resolvedColumns = buildColumns(columns);

  const preliminaryRows = buildRows(records, resolvedColumns);

  const resolvedGroups = buildGroups(preliminaryRows, groups);

  let rowNumber = 1;

  const numberedGroups = resolvedGroups.map((group) => ({
    ...group,

    rows: group.rows.map((row) => ({
      ...row,
      rowNumber: rowNumber++,
    })),
  }));

  const rows = numberedGroups.flatMap((group) => group.rows);

  const resolvedHeaderGroups = resolveHeaderGroups({
    columns: resolvedColumns,
    groups: columnGroups,
  });

  return {
    columns: resolvedColumns,

    headerGroups: resolvedHeaderGroups.map((group) => ({
      id: group.id,
      label: group.label,

      startColumnId: group.startColumnId,
      endColumnId: group.endColumnId,

      columnIds: group.columns.map((column) => column.id),

      startColumnIndex: group.startColumnIndex,
      endColumnIndex: group.endColumnIndex,

      colSpan: group.colSpan,
    })),

    groups: numberedGroups,
    rows,

    visibleRecordIds: rows.map((row) => row.id),

    columnCount: resolvedColumns.length,
    recordCount: rows.length,
  };
}