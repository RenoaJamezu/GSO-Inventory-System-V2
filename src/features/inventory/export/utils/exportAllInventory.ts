import { getInventoryReportAccounts } from "../api/inventoryReport.api";
import { buildInventoryWorkbook } from "../builders/buildInventoryWorkbook";

import { downloadWorkbook } from "./downloadWorkbook";

import type { ExportAllInventoryParams } from "../types";

export async function exportAllInventory({
  inventoryType,
  filename,
  accounts,
}: ExportAllInventoryParams) {
  const reportAccounts = await getInventoryReportAccounts(
    accounts,
    inventoryType,
  );

  const workbook = buildInventoryWorkbook(reportAccounts);

  downloadWorkbook(workbook, filename);
}
