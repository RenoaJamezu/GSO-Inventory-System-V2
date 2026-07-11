import { Button } from "@/components/ui";
import type { Group } from "../../types";
import { useDeleteGroup } from "../../hooks/useInventoryRecordGroups";

type Props = {
  groups: Group[];
  onEdit: (group: Group) => void;
};

export default function InventoryGroupCard({ groups, onEdit }: Props) {
  const deleteMutation = useDeleteGroup();

  async function handleDelete(group: Group) {
    const confirmed = window.confirm(
      `Delete "${group.group_name}"?\n\nAll records inside this group will be moved to "No Group".`,
    );

    if (!confirmed) return;

    try {
      await deleteMutation.mutateAsync({
        id: group.id,
        account_id: group.account_id,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to delete group.");
    }
  }

  if (!groups.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">
        <p className="text-sm text-gray-500">No groups created yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {groups.map((group) => (
        <div
          key={group.id}
          className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-gray-900">{group.group_name}</h3>

            <p className="mt-1 text-sm text-gray-500">
              {group.description || "No description"}
            </p>

            <p className="mt-3 text-xs text-gray-400">
              Sort Order: {group.sort_order}
            </p>
          </div>

          <div className="ml-4 flex shrink-0 gap-2">
            <Button variant="secondary" onClick={() => onEdit(group)}>
              Edit
            </Button>

            <Button
              variant="danger"
              onClick={() => handleDelete(group)}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
