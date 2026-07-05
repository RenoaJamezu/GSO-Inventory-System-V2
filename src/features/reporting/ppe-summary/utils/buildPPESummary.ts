import type { InventoryAccount } from "@/features/inventory-accounts";
import type { PPESummaryData } from "../types";

type BuildPPESummaryParams = {
  accounts: InventoryAccount[];
  propertyType: string;
  asOf?: Date;
};

export function buildPPESummary({
  accounts,
  propertyType,
  asOf = new Date(date),
}: BuildPPESummaryParams): PPESummaryData {
  const rows = accounts.map((account) => ({
    id: account.id,
    account_title: account.account_title,
    book_value: Number(account.book_value),
    per_inventory_report: Number(account.per_inventory_report),
    variance: Number(account.variance),
  }));

  return {
    reportTitle:
      "REPORT ON THE PHYSICAL COUNT OF PROPERTY, PLANT AND EQUIPMENT",

    propertyType,

    asOf,

    rows,

    totals: {
      bookValue: rows.reduce((sum, row) => sum + row.book_value, 0),

      perInventoryReport: rows.reduce(
        (sum, row) => sum + row.per_inventory_report,
        0,
      ),

      variance: rows.reduce((sum, row) => sum + row.variance, 0),
    },
  };
}
