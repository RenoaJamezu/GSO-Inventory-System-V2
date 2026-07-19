import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { InventoryRecordInput, InventoryType } from "../types";
import {
  getInventoryRecords,
  getInventoryRecord,
  createInventoryRecord,
  updateInventoryRecord,
  deleteInventoryRecord,
  getInventoryRecordByUuid,
  bulkCreateInventoryRecords,
  bulkDeleteInventoryRecords,
  bulkAssignGroup,
} from "../api/inventoryRecords.api";

export function useInventoryRecords(
  accountId: number,
  inventoryType: InventoryType,
) {
  return useQuery({
    queryKey: ["inventory-records", accountId, inventoryType],
    queryFn: async () => {
      return getInventoryRecords(accountId, inventoryType);
    },
    enabled: !!accountId,
  });
}

export function useInventoryRecord(id: number) {
  return useQuery({
    queryKey: ["inventory-record", id],
    queryFn: () => getInventoryRecord(id),
    enabled: !!id,
  });
}

export function useCreateInventoryRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryRecord,

    onSuccess(variables) {
      queryClient.invalidateQueries({
        queryKey: [
          "inventory-records",
          variables.account_id,
          variables.inventory_type,
        ],
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

    onSuccess(data) {
      queryClient.invalidateQueries({
        queryKey: ["inventory-records", data.account_id, data.inventory_type],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-record", data.id],
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

    onSuccess(record) {
      queryClient.invalidateQueries({
        queryKey: [
          "inventory-records",
          record.account_id,
          record.inventory_type,
        ],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-record", record.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      });
    },
  });
}

export function useInventoryRecordByUuid(uuid: string) {
  return useQuery({
    queryKey: ["inventory-record-uuid", uuid],
    queryFn: () => getInventoryRecordByUuid(uuid),
    enabled: !!uuid,
  });
}

export function useBulkInsertInventoryRecords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkCreateInventoryRecords,

    onSuccess(data) {
      if (!data.length) return;

      queryClient.invalidateQueries({
        queryKey: [
          "inventory-records",
          data[0].account_id,
          data[0].inventory_type,
        ],
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

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["inventory-records"],
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

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["inventory-records"],
      });
    },
  });
}
