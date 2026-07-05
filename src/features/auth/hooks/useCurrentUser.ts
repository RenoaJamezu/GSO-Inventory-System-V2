import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/auth.api";
import { useAuth } from "./useAuth";

export function useCurrentUser() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUser,
    enabled: isAuthenticated,
    staleTime: Infinity,
  });
}
