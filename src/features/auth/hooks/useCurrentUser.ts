import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api";
import { useAuth } from "./useAuth";

export function useCurrentUser() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,

    // Refresh every minute
    staleTime: 60 * 1000,

    // Refresh when returning to the tab
    refetchOnWindowFocus: true,

    // Refresh when reconnecting
    refetchOnReconnect: true,
  });
}
