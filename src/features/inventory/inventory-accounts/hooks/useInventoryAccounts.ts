import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { InventoryType } from "@/features/inventory/inventory-records";

import {
  createInventoryAccount,
  deleteInventoryAccount,
  getInventoryAccountById,
  getInventoryAccounts,
  updateInventoryAccount,
} from "../api/inventoryAccounts.api";
import {
  inventoryAccountKeys,
  type InventoryAccountFilters,
} from "../queryKeys";
import type { InventoryAccountInput } from "../types";

export function useInventoryAccounts(
  inventoryType: InventoryType,
  filters?: InventoryAccountFilters,
) {
  return useQuery({
    queryKey: inventoryAccountKeys.list(inventoryType, filters),
    queryFn: () => getInventoryAccounts(inventoryType, filters),
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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryAccountKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
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

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryAccountKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: inventoryAccountKeys.detail(variables.id),
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      });
    },
  });
}

export function useDeleteInventoryAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryAccount,

    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: inventoryAccountKeys.lists(),
      });

      queryClient.removeQueries({
        queryKey: inventoryAccountKeys.detail(id),
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard-summary"],
      });
    },
  });
}
