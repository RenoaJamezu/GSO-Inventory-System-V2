export interface InventoryAccount {
  id: number;
  account_title: string;
  slug: string;
  book_value: number;
  per_inventory_report: number;
  variance: number;

  is_par_visible: boolean;
  is_high_cost_visible: boolean;
  is_low_cost_visible: boolean;

  is_active: boolean;
  deleted_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface InventoryAccountInput {
  account_title: string;
  slug: string;

  book_value?: number;
  variance?: number;

  is_par_visible: boolean;
  is_high_cost_visible: boolean;
  is_low_cost_visible: boolean;
}

export type WorkspaceType = "PAR" | "HIGH_COST" | "LOW_COST";
