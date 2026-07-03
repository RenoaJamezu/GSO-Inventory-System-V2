import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getGroups,
  getGroup,
  createGroup,
  updateGroup,
  deleteGroup,
} from "../api/groups.api";
import type { GroupInput } from "../types";

const QUERY_KEY = "groups";

export function useGroups(accountId: number) {
  return useQuery({
    queryKey: [QUERY_KEY, accountId],
    queryFn: () => getGroups(accountId),
    enabled: !!accountId,
  });
}

export function useGroup(id: number) {
  return useQuery({
    queryKey: [QUERY_KEY, id],
    queryFn: () => getGroup(id),
    enabled: !!id,
  });
}

export function useCreateGroup() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,

    onSuccess: (group) => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY, group.account_id],
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
        queryKey: [QUERY_KEY, group.account_id],
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
        queryKey: [QUERY_KEY, group.account_id],
      });

      queryClient.invalidateQueries({
        queryKey: ["inventory-records", group.account_id],
      });
    },
  });
}
