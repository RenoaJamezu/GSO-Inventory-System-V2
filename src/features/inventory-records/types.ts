export interface InventoryRecord {
  id: number;
  
  account_id: number;
  group_id: number | null;
  qr_uuid: string;
  data: Record<string, unknown>;
  
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface InventoryRecordInput {
  account_id: number;
  group_id: number | null;
  data: Record<string, unknown>;
}
