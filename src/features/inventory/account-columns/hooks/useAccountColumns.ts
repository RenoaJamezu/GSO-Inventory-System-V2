import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import {
  getAccountColumns,
  createAccountColumn,
  updateAccountColumn,
  deleteAccountColumn,
} from "../api/accountColumns.api";
import { accountColumnKeys } from "../queryKeys";
import type { AccountColumnInput } from "../types";

export function useAccountColumns(accountId: number) {
  return useQuery({
    queryKey: accountColumnKeys.all(accountId),
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
        queryKey: accountColumnKeys.all(variables.account_id),
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
        queryKey: accountColumnKeys.all(variables.values.account_id),
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
        queryKey: accountColumnKeys.all(variables.account_id),
      });
    },
  });
}
