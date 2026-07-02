import { useDeleteGroup } from "../hooks/useGroups";

import type { Group } from "../types";

type Props = {
  groups: Group[];
  onEdit: (group: Group) => void;
};

export default function GroupsTable({ groups, onEdit }: Props) {
  const deleteMutation = useDeleteGroup();

  const handleDelete = (group: Group) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${group.group_name}"?`,
    );

    if (!confirmed) return;

    deleteMutation.mutate({
      id: group.id,
      account_id: group.account_id,
    });
  };

  return (
    <div className="overflow-x-auto rounded border">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-center">No.</th>

            <th className="border px-4 py-2 text-left">Group Name</th>

            <th className="border px-4 py-2 text-left">Description</th>

            <th className="border px-4 py-2 text-center">Sort Order</th>

            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {groups.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className="border px-4 py-8 text-center text-gray-500"
              >
                No groups found.
              </td>
            </tr>
          )}

          {groups.map((group, index) => (
            <tr key={group.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-center">{index + 1}</td>

              <td className="border px-4 py-2">{group.group_name}</td>

              <td className="border px-4 py-2">{group.description || "-"}</td>

              <td className="border px-4 py-2 text-center">
                {group.sort_order}
              </td>

              <td className="border px-4 py-2">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(group)}
                    className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(group)}
                    disabled={deleteMutation.isPending}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
