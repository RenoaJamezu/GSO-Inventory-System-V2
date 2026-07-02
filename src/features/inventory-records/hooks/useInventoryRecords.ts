import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createInventoryRecord,
  deleteInventoryRecord,
  getInventoryRecord,
  getInventoryRecords,
  updateInventoryRecord,
} from "../api/inventoryRecords.api";

import type { InventoryRecordInput } from "../types";

export function useInventoryRecords(accountId: number) {
  return useQuery({
    queryKey: ["inventory-records", accountId],
    queryFn: () => getInventoryRecords(accountId),
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

    onSuccess(_, variables) {
      queryClient.invalidateQueries({
        queryKey: ["inventory-records", variables.account_id],
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
        queryKey: ["inventory-records", data.account_id],
      });
    },
  });
}

export function useDeleteInventoryRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (record: { id: number; account_id: number }) => {
      await deleteInventoryRecord(record.id);

      return record;
    },

    onSuccess(record) {
      queryClient.invalidateQueries({
        queryKey: ["inventory-records", record.account_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-record", record.id],
      });
    },
  });
}
