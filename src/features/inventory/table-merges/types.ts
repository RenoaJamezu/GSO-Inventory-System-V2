export interface AccountColumnGroup {
  id: number;
  account_id: number;
  label: string;
  start_column_id: number;
  end_column_id: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface AccountColumnGroupInput {
  account_id: number;
  label: string;
  start_column_id: number;
  end_column_id: number;
}

export interface DeleteAccountColumnGroupInput {
  id: number;
  account_id: number;
}
