import { useState, useMemo } from "react";
import type { InventoryRecord, Group } from "../types";
import { filterInventoryRecords } from "../utils/filterInventoryRecords";

type Params = {
  records: InventoryRecord[];
  groups: Group[];
};

export function useInventoryRecordFilters({ records, groups }: Params) {
  const [search, setSearch] = useState("");

  const [groupId, setGroupId] = useState<number | null>(null);

  const filteredRecords = useMemo(
    () =>
      filterInventoryRecords({
        records,
        groups,
        search,
        groupId,
      }),
    [records, groups, search, groupId],
  );

  function clearFilters() {
    setSearch("")
    setGroupId(null)
  }

  return {
    search,
    setSearch,

    groupId,
    setGroupId,

    filteredRecords,

    clearFilters
  };
}
