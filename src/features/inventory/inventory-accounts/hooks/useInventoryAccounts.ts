import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { InventoryType } from "@/features/inventory/inventory-records";
import {
  createInventoryAccount,
  deleteInventoryAccount,
  getInventoryAccountById,
  getInventoryAccounts,
  updateInventoryAccount,
} from "../api/inventoryAccounts.api";
import { inventoryAccountKeys } from "../queryKeys";
import type { InventoryAccountInput } from "../types";

export function useInventoryAccounts(
  inventoryType: InventoryType,
  filters?: {
    is_par_visible?: boolean;
    is_high_cost_visible?: boolean;
    is_low_cost_visible?: boolean;
  },
) {
  return useQuery({
    queryKey: [
      "inventory-accounts",
      inventoryType,
      filters?.is_par_visible,
      filters?.is_high_cost_visible,
      filters?.is_low_cost_visible,
    ],
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

    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: inventoryAccountKeys.all,
        exact: false,
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
        exact: false,
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
        exact: false,
      });
    },
  });
}
