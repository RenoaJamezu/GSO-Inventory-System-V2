import type { Group } from "@/features/groups";

type Props = {
  selectedIds: number[];

  groups: Group[];

  selectedGroupId: string;

  setSelectedGroupId: React.Dispatch<React.SetStateAction<string>>;

  onApplyGroup: () => void;

  onPrint: () => void;

  onDelete: () => void;
};

export default function InventoryBulkToolbar({
  selectedIds,
  groups,
  selectedGroupId,
  setSelectedGroupId,
  onApplyGroup,
  onPrint,
  onDelete,
}: Props) {
  if (!selectedIds.length) return null;

  return (
    <div className="mb-6 flex items-center justify-between rounded-xl border bg-gray-50 p-4">
      <div className="w-1/5 font-medium text-gray-700">
        {selectedIds.length} record
        {selectedIds.length > 1 ? "s" : ""} selected
      </div>

      <div className="flex items-center gap-2 w-full justify-end">
        <div className="w-2/5">
          <select
            value={selectedGroupId}
            onChange={(e) => setSelectedGroupId(e.target.value)}
            className="w-full rounded border px-3 py-2"
          >
            <option value="">Assign Group...</option>

            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.group_name}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={onApplyGroup}
          disabled={!selectedGroupId}
          className="rounded bg-orange-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Apply Group
        </button>

        <button
          onClick={onPrint}
          className="rounded bg-green-600 px-4 py-2 text-white"
        >
          Print Selected
        </button>

        <button
          onClick={onDelete}
          className="rounded bg-red-600 px-4 py-2 text-white"
        >
          Delete Selected
        </button>
      </div>
    </div>
  );
}
