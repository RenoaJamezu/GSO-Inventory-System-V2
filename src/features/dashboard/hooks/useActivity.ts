import { useQuery } from "@tanstack/react-query";

import { getRecentActivity } from "../api/activity.api";

export const activityKeys = {
  all: ["activity"] as const,

  recent: (limit: number) => [...activityKeys.all, "recent", limit] as const,
};

export function useRecentActivity(limit = 10) {
  return useQuery({
    queryKey: activityKeys.recent(limit),

    queryFn: () => getRecentActivity(limit),

    staleTime: 30 * 1000,

    refetchOnMount: "always",

    refetchOnWindowFocus: true,
  });
}
