import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { GroupInput } from "../types";
import {
  createGroup,
  deleteGroup,
  getGroups,
  updateGroup,
} from "../api/inventoryRecordGroups.api";

const GROUPS_QUERY_KEY = "groups";
const GROUP_QUERY_KEY = "group";

export function useInventoryRecordGroups(accountId: number) {
  return useQuery({
    queryKey: [GROUPS_QUERY_KEY, "account", accountId],
    queryFn: () => getGroups(accountId),
    enabled: !!accountId,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,

    onSuccess: (group) => {
      queryClient.invalidateQueries({
        queryKey: [GROUPS_QUERY_KEY, "account", group.account_id],
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
        queryKey: [GROUPS_QUERY_KEY, "account", group.account_id],
      });

      queryClient.invalidateQueries({
        queryKey: [GROUP_QUERY_KEY, group.id],
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
        queryKey: [GROUPS_QUERY_KEY, "account", group.account_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-records", group.account_id],
      });

      queryClient.removeQueries({
        queryKey: [GROUP_QUERY_KEY, group.id],
      });
    },
  });
}
