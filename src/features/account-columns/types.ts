export type ColumnDataType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "boolean";

export interface AccountColumn {
  is_amount: unknown;
  id: number;
  account_id: number;

  field_key: string;
  label: string;

  data_type: ColumnDataType;

  is_required: boolean;
  is_amount_column: boolean;

  display_order: number;

  placeholder: string | null;

  description: string | null;

  deleted_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface AccountColumnInput {
  account_id: number;

  label: string;

  data_type: ColumnDataType;

  is_required: boolean;

  is_amount_column: boolean;

  placeholder?: string | null;

  description?: string | null;
}

export interface DeleteAccountColumnInput {
  id: number;
  account_id: number;
}
