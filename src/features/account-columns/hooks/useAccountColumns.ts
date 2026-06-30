import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAccountColumn,
  deleteAccountColumn,
  getAccountColumns,
  updateAccountColumn,
} from "../api/accountColumns.api";

import type { AccountColumnInput } from "../types";

export function useAccountColumns(accountId: number) {
  return useQuery({
    queryKey: ["account-columns", accountId],
    queryFn: () => getAccountColumns(accountId),
    enabled: !!accountId,
  });
}

export function useCreateAccountColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccountColumn,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["account-columns", variables.account_id],
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
        queryKey: ["account-columns", variables.values.account_id],
      });
    },
  });
}

export function useDeleteAccountColumn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccountColumn,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account-columns"],
      });
    },
  });
}
