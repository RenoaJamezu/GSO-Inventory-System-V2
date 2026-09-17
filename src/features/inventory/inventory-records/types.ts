import type * as XLSX from "xlsx";

export type InventoryRecordData = Record<string, unknown>;

export type InventoryType = "PAR" | "HIGH_COST" | "LOW_COST";

export interface InventoryRecord {
  id: number;

  account_id: number;
  group_id: number | null;

  inventory_type: InventoryType;

  qr_uuid: string;

  sort_order: number;

  data: InventoryRecordData;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface InventoryRecordInput {
  account_id: number;
  group_id: number | null;

  inventory_type: InventoryType;

  data: InventoryRecordData;
}

export interface InventoryRecordUpdate {
  id: number;
  account_id: number;
  inventory_type: InventoryType;

  values: {
    group_id: number | null;
    data: InventoryRecordData;
  };
}
export interface DeleteInventoryRecordInput {
  id: number;
  account_id: number;
  inventory_type: InventoryType;
}

export interface BulkDeleteInventoryRecordsInput {
  ids: number[];
  account_id: number;
  inventory_type: InventoryType;
}

export interface BulkAssignGroupInput {
  ids: number[];
  account_id: number;
  inventory_type: InventoryType;
  group_id: number | null;
}

export interface PreviewRow {
  id: string;
  group_id: number | null;
  data: InventoryRecordData;
}

export type ExcelWorkbook = XLSX.WorkBook;

export type ColumnMapping = Record<string, string>;

export interface Group {
  id: number;

  account_id: number;

  group_name: string;
  description: string | null;

  sort_order: number;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface GroupInput {
  account_id: number;

  group_name: string;

  description?: string | null;

  sort_order?: number;
}

export interface UpdateGroupInput {
  id: number;
  account_id: number;
  values: Partial<Omit<GroupInput, "account_id">>;
}

export interface DeleteGroupInput {
  id: number;
  account_id: number;
}

export interface GroupOrderUpdate {
  id: number;
  sort_order: number;
}

export interface ReorderGroupsInput {
  accountId: number;
  groups: GroupOrderUpdate[];
}

export interface InventoryRecordOrderUpdate {
  id: number;
  sort_order: number;
}

export interface ReorderInventoryRecordsInput {
  accountId: number;
  inventoryType: InventoryType;
  groupId: number | null;

  records: InventoryRecordOrderUpdate[];
}
