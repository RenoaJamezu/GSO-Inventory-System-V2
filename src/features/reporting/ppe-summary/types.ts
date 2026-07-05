export interface PPESummaryRow {
  id: number;
  account_title: string;
  book_value: number;
  per_inventory_report: number;
  variance: number;
}

export interface PPESummaryData {
  reportTitle: string;
  propertyType: string;
  asOf: Date;
  rows: PPESummaryRow[];
  totals: {
    bookValue: number;
    perInventoryReport: number;
    variance: number;
  };
}
