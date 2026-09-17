import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAccountColumn,
  deleteAccountColumn,
  getAccountColumns,
  reorderAccountColumns,
  updateAccountColumn,
} from "../api/accountColumns.api";

import { accountColumnKeys } from "../queryKeys";

import type {
  AccountColumn,
  AccountColumnInput,
  ReorderAccountColumnsInput,
} from "../types";

export function useAccountColumns(accountId: number) {
  return useQuery({
    queryKey: accountColumnKeys.list(accountId),

    queryFn: () => getAccountColumns(accountId),

    enabled: accountId > 0,
  });
}

export function useCreateAccountColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccountColumn,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: accountColumnKeys.list(variables.account_id),
      });
    },
  });
}

export function useUpdateAccountColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: AccountColumnInput }) =>
      updateAccountColumn(id, values),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: accountColumnKeys.list(variables.values.account_id),
      });
    },
  });
}

export function useDeleteAccountColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccountColumn,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: accountColumnKeys.list(variables.account_id),
      });
    },
  });
}

export function useReorderAccountColumns() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderAccountColumns,

    onMutate: async ({ accountId, columns }: ReorderAccountColumnsInput) => {
      const queryKey = accountColumnKeys.list(accountId);

      await queryClient.cancelQueries({
        queryKey,
      });

      const previousColumns =
        queryClient.getQueryData<AccountColumn[]>(queryKey);

      if (previousColumns) {
        const orderById = new Map(
          columns.map((column) => [column.id, column.display_order]),
        );

        const optimisticColumns = previousColumns
          .map((column) => ({
            ...column,

            display_order: orderById.get(column.id) ?? column.display_order,
          }))
          .sort((firstColumn, secondColumn) => {
            if (firstColumn.display_order !== secondColumn.display_order) {
              return firstColumn.display_order - secondColumn.display_order;
            }

            return firstColumn.id - secondColumn.id;
          });

        queryClient.setQueryData(queryKey, optimisticColumns);
      }

      return {
        previousColumns,
      };
    },

    onError: (_error, variables, context) => {
      if (context?.previousColumns) {
        queryClient.setQueryData(
          accountColumnKeys.list(variables.accountId),
          context.previousColumns,
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: accountColumnKeys.list(variables.accountId),
      });
    },
  });
}
