import { useMemo, useState } from "react";

import type { Group } from "@/features/groups";
import type { InventoryRecord } from "../types";

import { filterInventoryRecords } from "../utils/filterInventoryRecords";

type Params = {
  records: InventoryRecord[];
  groups: Group[];
};

export function useInventoryRecordFilters({ records, groups }: Params) {
  const [search, setSearch] = useState("");

  const filteredRecords = useMemo(() => {
    return filterInventoryRecords({
      records,
      groups,
      search,
    });
  }, [records, groups, search]);

  return {
    search,
    setSearch,

    filteredRecords,
  };
}
