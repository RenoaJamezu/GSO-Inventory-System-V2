import type { InventoryTableColumn, InventoryTableHeaderGroup } from "./types";

export interface InventoryTableHeaderCell {
  key: string;
  label: string;
  columnId?: number;
  colSpan: number;
  rowSpan: number;
  isGroup: boolean;
}

export interface InventoryTableHeaderRows {
  top: InventoryTableHeaderCell[];
  bottom: InventoryTableHeaderCell[];
  hasGroups: boolean;
}

interface BuildHeaderRowsParams {
  columns: InventoryTableColumn[];
  headerGroups: InventoryTableHeaderGroup[];
}

export function buildHeaderRows({
  columns,
  headerGroups,
}: BuildHeaderRowsParams): InventoryTableHeaderRows {
  if (headerGroups.length === 0) {
    return {
      top: columns.map((column) => ({
        key: `column-${column.id}`,
        label: column.label,
        columnId: column.id,
        colSpan: 1,
        rowSpan: 1,
        isGroup: false,
      })),
      bottom: [],
      hasGroups: false,
    };
  }

  const groupByStartColumnId = new Map(
    headerGroups.map((group) => [group.startColumnId, group]),
  );

  const groupedColumnIds = new Set(
    headerGroups.flatMap((group) => group.columnIds),
  );

  const top: InventoryTableHeaderCell[] = [];
  const bottom: InventoryTableHeaderCell[] = [];

  for (const column of columns) {
    const group = groupByStartColumnId.get(column.id);

    if (group) {
      top.push({
        key: `group-${group.id}`,
        label: group.label,
        colSpan: group.colSpan,
        rowSpan: 1,
        isGroup: true,
      });

      for (const columnId of group.columnIds) {
        const groupedColumn = columns.find(
          (candidate) => candidate.id === columnId,
        );

        if (!groupedColumn) {
          continue;
        }

        bottom.push({
          key: `column-${groupedColumn.id}`,
          label: groupedColumn.label,
          columnId: groupedColumn.id,
          colSpan: 1,
          rowSpan: 1,
          isGroup: false,
        });
      }

      continue;
    }

    if (groupedColumnIds.has(column.id)) {
      continue;
    }

    top.push({
      key: `column-${column.id}`,
      label: column.label,
      columnId: column.id,
      colSpan: 1,
      rowSpan: 2,
      isGroup: false,
    });
  }

  return {
    top,
    bottom,
    hasGroups: true,
  };
}
