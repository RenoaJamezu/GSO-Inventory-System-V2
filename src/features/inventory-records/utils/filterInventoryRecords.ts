import type { Group } from "@/features/groups";
import type { InventoryRecord } from "../types";

type Params = {
  records: InventoryRecord[];
  groups: Group[];
  search: string;
};

export function filterInventoryRecords({
  records,
  groups,
  search,
}: Params): InventoryRecord[] {
  const keyword = search.trim().toLowerCase();

  if (!keyword) {
    return records;
  }

  const words = keyword.split(/\s+/);

  return records.filter((record) => {
    const groupName =
      groups.find((group) => group.id === record.group_id)?.group_name ?? "";

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
