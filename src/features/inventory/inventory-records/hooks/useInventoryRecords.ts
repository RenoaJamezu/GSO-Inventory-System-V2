import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  bulkAssignGroup,
  bulkCreateInventoryRecords,
  bulkDeleteInventoryRecords,
  createInventoryRecord,
  deleteInventoryRecord,
  getInventoryRecord,
  getInventoryRecordByUuid,
  getInventoryRecords,
  updateInventoryRecord,
} from "../api/inventoryRecords.api";
import { inventoryRecordKeys } from "../queryKeys";
import type { InventoryRecordInput, InventoryType } from "../types";

export function useInventoryRecords(
  accountId: number,
  inventoryType: InventoryType,
) {
  return useQuery({
    queryKey: inventoryRecordKeys.list(accountId, inventoryType),
    queryFn: () => getInventoryRecords(accountId, inventoryType),
    enabled: accountId > 0,
  });
}

export function useInventoryRecord(id: number) {
  return useQuery({
    queryKey: inventoryRecordKeys.detail(id),
    queryFn: () => getInventoryRecord(id),
    enabled: id > 0,
  });
}

export function useCreateInventoryRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryRecord,

    onSuccess: (record) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.list(
          record.account_id,
          record.inventory_type,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      });
    },
  });
}

export function useUpdateInventoryRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: Partial<InventoryRecordInput>;
    }) => updateInventoryRecord(id, values),

    onSuccess: (record) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.list(
          record.account_id,
          record.inventory_type,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.detail(record.id),
      });

      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.uuid(record.qr_uuid),
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      });
    },
  });
}

export function useDeleteInventoryRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: {
      id: number;
      account_id: number;
      inventory_type: InventoryType;
    }) => {
      await deleteInventoryRecord(record.id);

      return record;
    },

    onSuccess: (record) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.list(
          record.account_id,
          record.inventory_type,
        ),
      });

      queryClient.removeQueries({
        queryKey: inventoryRecordKeys.detail(record.id),
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      });
    },
  });
}

export function useInventoryRecordByUuid(uuid: string) {
  return useQuery({
    queryKey: inventoryRecordKeys.uuid(uuid),
    queryFn: () => getInventoryRecordByUuid(uuid),
    enabled: Boolean(uuid),
  });
}

export function useBulkInsertInventoryRecords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkCreateInventoryRecords,

    onSuccess: (records) => {
      const affectedLists = new Set(
        records.map(
          (record) => `${record.account_id}:${record.inventory_type}`,
        ),
      );

      affectedLists.forEach((key) => {
        const [accountId, inventoryType] = key.split(":");

        queryClient.invalidateQueries({
          queryKey: inventoryRecordKeys.list(
            Number(accountId),
            inventoryType as InventoryType,
          ),
        });
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      });
    },
  });
}

export function useBulkDeleteInventoryRecords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteInventoryRecords,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      });
    },
  });
}

export function useBulkAssignGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, groupId }: { ids: number[]; groupId: number | null }) =>
      bulkAssignGroup(ids, groupId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.lists(),
      });
    },
  });
}
