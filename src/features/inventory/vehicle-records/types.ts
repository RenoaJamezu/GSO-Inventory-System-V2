export type VehicleRecord = {
  id: number;

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
};

export type VehicleRecordInput = {
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
