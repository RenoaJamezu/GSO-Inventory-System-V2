import { useQuery } from "@tanstack/react-query";

import { getPublicInventoryRecord } from "../api/public.api";
import { publicRecordKeys } from "../queryKeys";

export function usePublicInventoryRecord(uuid: string) {
  return useQuery({
    queryKey: publicRecordKeys.detail(uuid),
    queryFn: () => getPublicInventoryRecord(uuid),
    enabled: Boolean(uuid),
  });
}
