import * as XLSX from "xlsx";
import type { InventoryAccount } from "../../inventory-accounts";

const START_ROW = 2;

export function writeWorkspaceRows(
  workbook: XLSX.WorkBook,
  accounts: InventoryAccount[],
) {
  const sheet = workbook.Sheets[workbook.SheetNames[0]];

  accounts.forEach((account, index) => {
    const row = START_ROW + index;

    XLSX.utils.sheet_add_aoa(
      sheet,
      [
        [
          index + 1,
          account.account_title,
          account.book_value,
          account.per_inventory_report ?? 0,
          account.variance,
        ],
      ],
      {
        origin: `A${row}`,
      },
    );
  });

  return workbook;
}
