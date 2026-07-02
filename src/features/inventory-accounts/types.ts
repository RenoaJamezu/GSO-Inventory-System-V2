export interface InventoryAccount {
  id: number;
  account_title: string;
  slug: string;
  book_value: number;
  per_inventory_report: number;
  variance: number;

  is_active: boolean;
  deleted_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface InventoryAccountInput {
  account_title: string;
  slug: string;
  book_value: number;
  variance: number;
}
