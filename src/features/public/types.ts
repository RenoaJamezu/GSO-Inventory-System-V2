export interface PublicColumn {
  field_key: string;
  label: string;
  data_type: string;
  display_order: number;
}

export interface PublicInventoryRecord {
  id: number;

  qr_uuid: string;

  account_title: string;

  group_name: string | null;

  data: Record<string, unknown>;

  columns: PublicColumn[];

  amount: number;

  inventory_type: string;
}
