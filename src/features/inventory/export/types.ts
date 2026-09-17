import type { InventoryAccount } from "../inventory-accounts";
import type { InventoryType } from "../inventory-records";
import type { InventoryTableLayout } from "../inventory-records/table-layout";

export type InventoryReportAccount = {
  account: InventoryAccount;
  layout: InventoryTableLayout;
};

export type ExportAllInventoryParams = {
  inventoryType: InventoryType;
  filename: string;
  accounts: InventoryAccount[];
};
