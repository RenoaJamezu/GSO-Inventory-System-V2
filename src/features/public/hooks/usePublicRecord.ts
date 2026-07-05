import { useQuery } from "@tanstack/react-query";
import {
  getPublicInventoryRecord,
  getPublicInventoryRecordsByIds,
} from "../api/public.api";

export function usePublicInventoryRecord(uuid: string) {
  return useQuery({
    queryKey: ["public-record", uuid],
    queryFn: () => getPublicInventoryRecord(uuid),
    enabled: !!uuid,
  });
}

export function usePublicInventoryRecords(ids: number[]) {
  return useQuery({
    queryKey: ["public-inventory-records", ids],
    queryFn: () => getPublicInventoryRecordsByIds(ids),
    enabled: ids.length > 0,
  });
}
