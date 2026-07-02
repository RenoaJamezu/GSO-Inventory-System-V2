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
