import { useMemo } from "react";

import type { AccountColumn } from "../../account-columns";
import type { AccountColumnGroup } from "../../table-merges";

import type { Group, InventoryRecord } from "../types";
import { buildInventoryTableLayout } from "../table-layout";

interface UseInventoryTableLayoutParams {
  columns: AccountColumn[];
  records: InventoryRecord[];
  groups: Group[];
  columnGroups?: AccountColumnGroup[];
}

export function useInventoryTableLayout({
  columns,
  records,
  groups,
  columnGroups = [],
}: UseInventoryTableLayoutParams) {
  return useMemo(
    () =>
      buildInventoryTableLayout({
        columns,
        records,
        groups,
        columnGroups,
      }),
    [columns, records, groups, columnGroups],
  );
}
