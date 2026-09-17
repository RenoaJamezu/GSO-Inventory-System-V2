import { getAccountColumns } from "../../account-columns/api/accountColumns.api";
import type { InventoryAccount } from "../../inventory-accounts";

import { getGroups } from "../../inventory-records/api/inventoryRecordGroups.api";
import { getInventoryRecords } from "../../inventory-records/api/inventoryRecords.api";
import type { InventoryType } from "../../inventory-records";
import { buildInventoryTableLayout } from "../../inventory-records/table-layout";

import { getAccountColumnGroups } from "../../table-merges/api/tableMerges.api";

import type { InventoryReportAccount } from "../types";

async function getInventoryReportAccount(
  account: InventoryAccount,
  inventoryType: InventoryType,
): Promise<InventoryReportAccount> {
  const [columns, records, groups, columnGroups] = await Promise.all([
    getAccountColumns(account.id),
    getInventoryRecords(account.id, inventoryType),
    getGroups(account.id),
    getAccountColumnGroups(account.id),
  ]);

  const layout = buildInventoryTableLayout({
    columns,
    records,
    groups,
    columnGroups,
  });

  return {
    account,
    layout,
  };
}

export async function getInventoryReportAccounts(
  accounts: InventoryAccount[],
  inventoryType: InventoryType,
): Promise<InventoryReportAccount[]> {
  return Promise.all(
    accounts.map((account) =>
      getInventoryReportAccount(account, inventoryType),
    ),
  );
}
