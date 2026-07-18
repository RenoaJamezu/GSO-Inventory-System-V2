import type { Group, InventoryRecord } from "../types";

type Params = {
  records: InventoryRecord[];
  groups: Group[];
  search: string;
  groupId: number | null;
};

export function filterInventoryRecords({
  records,
  groups,
  search,
  groupId,
}: Params): InventoryRecord[] {
  let filtered = records;

  if (groupId !== null) {
    filtered = filtered.filter((record) => record.group_id === groupId);
  }

  const keyword = search.trim().toLowerCase();

  if (!keyword) {
    return filtered;
  }

  const words = keyword.split(/\s+/);

  // Build once
  const groupMap = new Map(groups.map((group) => [group.id, group.group_name]));

  return filtered.filter((record) => {
    const groupName = groupMap.get(record.group_id ?? -1) ?? "";

    const searchable = [
      record.id,
      record.qr_uuid,
      groupName,
      ...Object.values(record.data),
    ]
      .join(" ")
      .toLowerCase();

    return words.every((word) => searchable.includes(word));
  });
}
