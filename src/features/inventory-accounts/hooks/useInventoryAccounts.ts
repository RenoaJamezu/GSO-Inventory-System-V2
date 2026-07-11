import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createInventoryAccount,
  deleteInventoryAccount,
  getInventoryAccountById,
  getInventoryAccounts,
  updateInventoryAccount,
} from "../api/inventoryAccounts.api";

import type { InventoryAccountInput } from "../types";

import { inventoryAccountKeys } from "../queryKeys";

export function useInventoryAccounts() {
  return useQuery({
    queryKey: inventoryAccountKeys.all,
    queryFn: getInventoryAccounts,
  });
}

export function useInventoryAccount(id: number) {
  return useQuery({
    queryKey: inventoryAccountKeys.detail(id),
    queryFn: () => getInventoryAccountById(id),
    enabled: id > 0,
  });
}

export function useCreateInventoryAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryAccount,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: inventoryAccountKeys.all,
      });
    },
  });
}

export function useUpdateInventoryAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: InventoryAccountInput;
    }) => updateInventoryAccount(id, values),

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: inventoryAccountKeys.all,
      });
    },
  });
}

export function useDeleteInventoryAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryAccount,

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: inventoryAccountKeys.all,
      });
    },
  });
}
