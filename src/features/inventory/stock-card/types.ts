export type StockCard = {
  id: number;

  item: string;
  stock_no: string;
  description: string | null;
  unit_of_measurement: string;
  reorder_point: number | null;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type StockCardInput = {
  item: string;
  stock_no: string;
  description: string | null;
  unit_of_measurement: string;
  reorder_point: number | null;
};

export type StockCardTransactionType = "RECEIPT" | "ISSUE";

export type StockCardTransaction = {
  id: number;
  stock_card_id: number;

  transaction_date: string;
  reference: string | null;

  transaction_type: StockCardTransactionType;
  quantity: number;

  office: string | null;
  days_to_consume: number | null;

  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type StockCardTransactionInput = {
  stock_card_id: number;

  transaction_date: string;
  reference: string | null;

  transaction_type: StockCardTransactionType;
  quantity: number;

  office: string | null;
  days_to_consume: number | null;
};

export type StockCardTransactionRow = StockCardTransaction & {
  receipt_quantity: number | null;
  issue_quantity: number | null;
  balance: number;
};
