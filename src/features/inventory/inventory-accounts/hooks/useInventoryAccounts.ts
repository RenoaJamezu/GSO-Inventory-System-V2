import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { InventoryType } from "@/features/inventory/inventory-records";

import {
  createInventoryAccount,
  deleteInventoryAccount,
  getInventoryAccountById,
  getInventoryAccounts,
  reorderInventoryAccounts,
  updateInventoryAccount,
} from "../api/inventoryAccounts.api";

import { inventoryAccountKeys } from "../queryKeys";

import type {
  InventoryAccount,
  InventoryAccountFilters,
  InventoryAccountInput,
  ReorderInventoryAccountsInput,
} from "../types";

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
        queryKey: ["dashboard"],
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
        queryKey: ["dashboard"],
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
        queryKey: ["dashboard"],
      });
    },
  });
}

export function useReorderInventoryAccounts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderInventoryAccounts,

    onMutate: async ({ accounts }: ReorderInventoryAccountsInput) => {
      const queryKey = inventoryAccountKeys.lists();

      await queryClient.cancelQueries({
        queryKey,
      });

      const previousQueries = queryClient.getQueriesData<InventoryAccount[]>({
        queryKey,
      });

      const orderById = new Map(
        accounts.map((account) => [account.id, account.sort_order]),
      );

      previousQueries.forEach(([cacheKey, cachedAccounts]) => {
        if (!cachedAccounts) {
          return;
        }

        const reordered = cachedAccounts
          .map((account) => ({
            ...account,

            sort_order: orderById.get(account.id) ?? account.sort_order,
          }))
          .sort((firstAccount, secondAccount) => {
            if (firstAccount.sort_order !== secondAccount.sort_order) {
              return firstAccount.sort_order - secondAccount.sort_order;
            }

            return firstAccount.id - secondAccount.id;
          });

        queryClient.setQueryData(cacheKey, reordered);
      });

      return {
        previousQueries,
      };
    },

    onError: (_error, _variables, context) => {
      context?.previousQueries.forEach(([queryKey, accounts]) => {
        queryClient.setQueryData(queryKey, accounts);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: inventoryAccountKeys.lists(),
      });
    },
  });
}
