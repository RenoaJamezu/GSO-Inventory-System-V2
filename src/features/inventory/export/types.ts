import type { InventoryAccount } from "../inventory-accounts";

export type ExportWorkspaceParams = {
  title: string;
  filename: string;
  accounts: InventoryAccount[];
};