import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createGroup,
  deleteGroup,
  getGroups,
  reorderGroups,
  updateGroup,
} from "../api/inventoryRecordGroups.api";

import { inventoryRecordGroupKeys, inventoryRecordKeys } from "../queryKeys";

import type {
  DeleteGroupInput,
  Group,
  ReorderGroupsInput,
  UpdateGroupInput,
} from "../types";

export function useInventoryRecordGroups(accountId: number) {
  return useQuery({
    queryKey: inventoryRecordGroupKeys.list(accountId),
    queryFn: () => getGroups(accountId),
    enabled: Number.isInteger(accountId) && accountId > 0,
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
    mutationFn: (input: UpdateGroupInput) => updateGroup(input),

    onSuccess: (group) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordGroupKeys.list(group.account_id),
      });
    },
  });
}

export function useDeleteGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteGroupInput) => deleteGroup(input),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordGroupKeys.list(variables.account_id),
      });

      queryClient.invalidateQueries({
        queryKey: inventoryRecordKeys.accountLists(variables.account_id),
      });
    },
  });
}

export function useReorderGroups() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: reorderGroups,

    onMutate: async ({ accountId, groups }: ReorderGroupsInput) => {
      const queryKey = inventoryRecordGroupKeys.list(accountId);

      await queryClient.cancelQueries({
        queryKey,
      });

      const previousGroups = queryClient.getQueryData<Group[]>(queryKey);

      if (previousGroups) {
        const orderById = new Map(
          groups.map((group) => [group.id, group.sort_order]),
        );

        const optimisticGroups = previousGroups
          .map((group) => ({
            ...group,
            sort_order: orderById.get(group.id) ?? group.sort_order,
          }))
          .sort((firstGroup, secondGroup) => {
            if (firstGroup.sort_order !== secondGroup.sort_order) {
              return firstGroup.sort_order - secondGroup.sort_order;
            }

            return firstGroup.id - secondGroup.id;
          });

        queryClient.setQueryData(queryKey, optimisticGroups);
      }

      return {
        previousGroups,
      };
    },

    onError: (_error, variables, context) => {
      if (context?.previousGroups) {
        queryClient.setQueryData(
          inventoryRecordGroupKeys.list(variables.accountId),
          context.previousGroups,
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: inventoryRecordGroupKeys.list(variables.accountId),
      });
    },
  });
}
