import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createGroup,
  deleteGroup,
  getGroups,
  updateGroup,
} from "../api/inventoryRecordGroups.api";
import { inventoryRecordGroupKeys, inventoryRecordKeys } from "../queryKeys";
import type { GroupInput } from "../types";

export function useInventoryRecordGroups(accountId: number) {
  return useQuery({
    queryKey: inventoryRecordGroupKeys.list(accountId),
    queryFn: () => getGroups(accountId),
    enabled: accountId > 0,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,

    onSuccess: (group) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordGroupKeys.list(group.account_id),
      });
    },
  });
}

export function useUpdateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<GroupInput> }) =>
      updateGroup(id, values),

    onSuccess: (group) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordGroupKeys.list(group.account_id),
      });

      queryClient.invalidateQueries({
        queryKey: inventoryRecordGroupKeys.detail(group.id),
      });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (group: { id: number; account_id: number }) => {
      await deleteGroup(group.id);

      return group;
    },

    onSuccess: (group) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordGroupKeys.list(group.account_id),
      });

      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.accountLists(group.account_id),
      });

      queryClient.removeQueries({
        queryKey: inventoryRecordGroupKeys.detail(group.id),
      });
    },
  });
}
