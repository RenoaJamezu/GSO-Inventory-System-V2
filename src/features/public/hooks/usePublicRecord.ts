import { useQuery } from "@tanstack/react-query";
import { getPublicInventoryRecord } from "../api/public.api";

export function usePublicInventoryRecord(uuid: string) {
  return useQuery({
    queryKey: ["public-record", uuid],
    queryFn: () => getPublicInventoryRecord(uuid),
    enabled: Boolean(uuid),
  });
}