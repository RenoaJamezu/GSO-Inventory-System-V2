import type { InventoryType } from "./types";

export const inventoryRecordKeys = {
  root: ["inventory-records"] as const,

  lists: () => [...inventoryRecordKeys.root, "list"] as const,

  list: (accountId: number, inventoryType: InventoryType) =>
    [...inventoryRecordKeys.lists(), accountId, inventoryType] as const,

  accountLists: (accountId: number) =>
    [...inventoryRecordKeys.lists(), accountId] as const,

  details: () => [...inventoryRecordKeys.root, "detail"] as const,

  detail: (id: number) => [...inventoryRecordKeys.details(), id] as const,

  uuid: (uuid: string) => [...inventoryRecordKeys.root, "uuid", uuid] as const,
};

export const inventoryRecordGroupKeys = {
  root: ["inventory-record-groups"] as const,

  lists: () => [...inventoryRecordGroupKeys.root, "list"] as const,

  list: (accountId: number) =>
    [...inventoryRecordGroupKeys.lists(), accountId] as const,

  details: () => [...inventoryRecordGroupKeys.root, "detail"] as const,

  detail: (id: number) => [...inventoryRecordGroupKeys.details(), id] as const,
};
