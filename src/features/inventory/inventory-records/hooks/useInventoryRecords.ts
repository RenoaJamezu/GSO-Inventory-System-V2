import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  bulkAssignGroup,
  bulkCreateInventoryRecords,
  bulkDeleteInventoryRecords,
  createInventoryRecord,
  deleteInventoryRecord,
  getInventoryRecords,
  reorderInventoryRecords,
  updateInventoryRecord,
} from "../api/inventoryRecords.api";

import { inventoryRecordKeys } from "../queryKeys";

import type {
  BulkAssignGroupInput,
  BulkDeleteInventoryRecordsInput,
  DeleteInventoryRecordInput,
  InventoryRecord,
  InventoryRecordUpdate,
  InventoryType,
  ReorderInventoryRecordsInput,
} from "../types";

export function useInventoryRecords(
  accountId: number,
  inventoryType: InventoryType,
) {
  return useQuery({
    queryKey: inventoryRecordKeys.list(accountId, inventoryType),
    queryFn: () => getInventoryRecords(accountId, inventoryType),
    enabled: Number.isInteger(accountId) && accountId > 0,
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
        queryKey: ["dashboard"],
      });
    },
  });
}

export function useUpdateInventoryRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: InventoryRecordUpdate) => updateInventoryRecord(input),

    onSuccess: (record) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.list(
          record.account_id,
          record.inventory_type,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}

export function useDeleteInventoryRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryRecord,

    onSuccess: (_, variables: DeleteInventoryRecordInput) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.list(
          variables.account_id,
          variables.inventory_type,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
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
        queryKey: ["dashboard"],
      });
    },
  });
}

export function useBulkDeleteInventoryRecords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkDeleteInventoryRecords,

    onSuccess: (_, variables: BulkDeleteInventoryRecordsInput) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.list(
          variables.account_id,
          variables.inventory_type,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}

export function useBulkAssignGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bulkAssignGroup,

    onSuccess: (_, variables: BulkAssignGroupInput) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.list(
          variables.account_id,
          variables.inventory_type,
        ),
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}

export function useReorderInventoryRecords() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderInventoryRecords,

    onMutate: async ({
      accountId,
      inventoryType,
      records,
    }: ReorderInventoryRecordsInput) => {
      const queryKey = inventoryRecordKeys.list(accountId, inventoryType);

      await queryClient.cancelQueries({
        queryKey,
      });

      const previousRecords =
        queryClient.getQueryData<InventoryRecord[]>(queryKey);

      if (previousRecords) {
        const orderById = new Map(
          records.map((record) => [record.id, record.sort_order]),
        );

        const optimisticRecords = previousRecords.map((record) => ({
          ...record,

          sort_order: orderById.get(record.id) ?? record.sort_order,
        }));

        queryClient.setQueryData(queryKey, optimisticRecords);
      }

      return {
        previousRecords,
      };
    },

    onError: (_error, variables, context) => {
      if (!context?.previousRecords) {
        return;
      }

      queryClient.setQueryData(
        inventoryRecordKeys.list(variables.accountId, variables.inventoryType),
        context.previousRecords,
      );
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.list(
          variables.accountId,
          variables.inventoryType,
        ),
      });
    },
  });
}
