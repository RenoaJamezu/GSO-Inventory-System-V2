import type { AccountColumn } from "@/features/inventory/account-columns";

import type { Group, InventoryRecord } from "../types";

export type TableColumnId = number;
export type TableRecordId = number;
export type TableGroupId = number | null;

export interface InventoryTableColumn {
  id: TableColumnId;
  fieldKey: string;
  label: string;
  dataType: AccountColumn["data_type"];
  displayOrder: number;
  isAmountColumn: boolean;
  source: AccountColumn;
}

export interface InventoryTableCell {
  columnId: TableColumnId;
  fieldKey: string;
  dataType: AccountColumn["data_type"];
  isAmountColumn: boolean;
  value: unknown;
}

export interface InventoryTableRow {
  id: TableRecordId;
  record: InventoryRecord;
  rowNumber: number;
  groupId: TableGroupId;
  cells: InventoryTableCell[];
}

export interface InventoryTableGroup {
  id: TableGroupId;
  name: string;
  sortOrder: number;
  rows: InventoryTableRow[];
  source: Group | null;
}

export interface InventoryTableLayout {
  columns: InventoryTableColumn[];

  headerGroups: InventoryTableHeaderGroup[];

  groups: InventoryTableGroup[];
  rows: InventoryTableRow[];

  visibleRecordIds: TableRecordId[];

  columnCount: number;
  recordCount: number;
}

export interface InventoryTableHeaderGroup {
  id: number;
  label: string;

  startColumnId: TableColumnId;
  endColumnId: TableColumnId;

  columnIds: TableColumnId[];

  startColumnIndex: number;
  endColumnIndex: number;

  colSpan: number;
}
