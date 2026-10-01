export type VehicleInventoryData = Record<string, unknown>;

export type LinkedInventoryRecord = {
  id: number;
  account_id: number;
  inventory_type: string;
  qr_uuid: string;
  data: VehicleInventoryData;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type VehicleRecord = {
  id: number;
  inventory_record_id: number | null;

  model: string;
  engine_no: string | null;
  chassis_no: string | null;

  plate_no: string;
  office: string | null;
  memorandum_receipt: string | null;

  driver: string | null;
  cellphone_no: string | null;

  expiration_date: string | null;

  property_no: string | null;
  date_acquired: string | null;
  cost: number | null;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;

  inventory_record?: LinkedInventoryRecord | null;
};

export type VehicleRecordInput = {
  inventory_record_id: number | null;

  model: string;
  engine_no: string | null;
  chassis_no: string | null;

  plate_no: string;
  office: string | null;
  memorandum_receipt: string | null;

  driver: string | null;
  cellphone_no: string | null;

  expiration_date: string | null;

  property_no: string | null;
  date_acquired: string | null;
  cost: number | null;
};
