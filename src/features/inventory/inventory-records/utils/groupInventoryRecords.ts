import type { Group, InventoryRecord } from "../types";

export type InventoryRecordGroup = {
  id: number | null;
  name: string;
  records: InventoryRecord[];
};

type Params = {
  records: InventoryRecord[];
  groups: Group[];
};

export function groupInventoryRecords({
  records,
  groups,
}: Params): InventoryRecordGroup[] {
  const map = new Map<number | null, InventoryRecord[]>();

  // Always create the "No Group" bucket
  map.set(null, []);

  // Create a bucket for every group
  groups.forEach((group) => {
    map.set(group.id, []);
  });

  // Put records into their bucket
  records.forEach((record) => {
    const bucket = map.get(record.group_id);

    if (bucket) {
      bucket.push(record);
    } else {
      map.get(null)?.push(record);
    }
  });

  const result: InventoryRecordGroup[] = [];

  // Add No Group only if it has records
  const noGroup = map.get(null);

  if (noGroup && noGroup.length > 0) {
    result.push({
      id: null,
      name: "No Group",
      records: noGroup,
    });
  }

  // Add ONLY groups that actually contain records
  groups.forEach((group) => {
    const groupRecords = map.get(group.id) ?? [];

    if (groupRecords.length === 0) {
      return;
    }

    result.push({
      id: group.id,
      name: group.group_name,
      records: groupRecords,
    });
  });

  return result;
}