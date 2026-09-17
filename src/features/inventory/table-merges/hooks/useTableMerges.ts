import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createAccountColumnGroup,
  deleteAccountColumnGroup,
  getAccountColumnGroups,
  updateAccountColumnGroup,
} from "../api/tableMerges.api";
import { accountColumnGroupKeys } from "../queryKeys";
import type { AccountColumnGroupInput } from "../types";

export function useAccountColumnGroups(accountId: number) {
  return useQuery({
    queryKey: accountColumnGroupKeys.list(accountId),
    queryFn: () => getAccountColumnGroups(accountId),
    enabled: Number.isInteger(accountId) && accountId > 0,
  });
}

export function useCreateAccountColumnGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAccountColumnGroup,

    onSuccess: (group) => {
      queryClient.invalidateQueries({
        queryKey: accountColumnGroupKeys.list(group.account_id),
      });
    },
  });
}

export function useUpdateAccountColumnGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      values,
    }: {
      id: number;
      values: AccountColumnGroupInput;
    }) => updateAccountColumnGroup(id, values),

    onSuccess: (group) => {
      queryClient.invalidateQueries({
        queryKey: accountColumnGroupKeys.list(group.account_id),
      });
    },
  });
}

export function useDeleteAccountColumnGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAccountColumnGroup,

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: accountColumnGroupKeys.list(variables.account_id),
      });
    },
  });
}
