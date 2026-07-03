import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getInventoryAccounts,
  createInventoryAccount,
  getInventoryAccountById,
  updateInventoryAccount,
  deleteInventoryAccount,
} from "../api/inventoryAccounts.api";
import type { InventoryAccountInput } from "../types";

export function useInventoryAccounts() {
  return useQuery({
    queryKey: ["inventory_accounts"],
    queryFn: getInventoryAccounts,
  });
}

export function useCreateInventoryAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInventoryAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory_accounts"],
      });
    },
  });
}

export function useInventoryAccount(id: number) {
  return useQuery({
    queryKey: ["inventory-account", id],
    queryFn: () => getInventoryAccountById(id),
    enabled: !!id,
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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory_accounts"],
      });
    },
  });
}

export function useDeleteInventoryAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteInventoryAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["inventory_accounts"],
      });
    },
  });
}
