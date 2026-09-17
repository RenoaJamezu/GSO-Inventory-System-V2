import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "../api/dashboard.api";
import { dashboardKeys } from "../queryKeys";

export function useDashboard() {
  return useQuery({
    queryKey: dashboardKeys.summary(),
    queryFn: getDashboardSummary,
    staleTime: 5 * 60 * 1000,
  });
}
