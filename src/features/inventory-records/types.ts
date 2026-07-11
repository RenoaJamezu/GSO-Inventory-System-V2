import type * as XLSX from "xlsx";

/* -------------------------------------------------------------------------- */
/*                                Inventory                                   */
/* -------------------------------------------------------------------------- */

export type InventoryRecordData = Record<string, unknown>;

export interface InventoryRecord {
  id: number;

  account_id: number;
  group_id: number | null;

  qr_uuid: string;

  data: InventoryRecordData;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface InventoryRecordInput {
  account_id: number;
  group_id: number | null;

  data: InventoryRecordData;
}

export interface InventoryRecordUpdate {
  id: number;

  values: {
    group_id: number | null;
    data: InventoryRecordData;
  };
}

/* -------------------------------------------------------------------------- */
/*                              Import / Preview                              */
/* -------------------------------------------------------------------------- */

export interface PreviewRow {
  id: string;

  selected: boolean;

  group_id: number | null;

  data: InventoryRecordData;
}

export type ExcelWorkbook = XLSX.WorkBook;

export type ExcelRow = InventoryRecordData;

export interface ParsedWorksheet {
  sheetName: string;

  rows: ExcelRow[];
}

export type ColumnMapping = Record<string, string>;

/* -------------------------------------------------------------------------- */
/*                                   Groups                                   */
/* -------------------------------------------------------------------------- */

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
