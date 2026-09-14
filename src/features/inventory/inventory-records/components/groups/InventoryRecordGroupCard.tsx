import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { ConfirmDialog } from "@/components/dialog";
import { Button } from "@/components/ui";

import type { Group } from "../../types";

import { useDeleteGroup } from "../../hooks/useInventoryRecordGroups";

type Props = {
  groups: Group[];
  onEdit: (group: Group) => void;
};

export default function InventoryRecordGroupCard({ groups, onEdit }: Props) {
  const deleteMutation = useDeleteGroup();

  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  function requestDelete(group: Group) {
    setGroupToDelete(group);
  }

  function closeDeleteDialog() {
    if (deleteMutation.isPending) return;

    setGroupToDelete(null);
  }

  async function confirmDelete() {
    if (!groupToDelete) return;

    try {
      await deleteMutation.mutateAsync({
        id: groupToDelete.id,
        account_id: groupToDelete.account_id,
      });

      setGroupToDelete(null);
    } catch (error) {
      console.error("Failed deleting inventory group", error);
    }
  }

  if (!groups.length) {
    return (
      <div
        className="
          rounded-lg border
          border-dashed
          border-slate-300
          px-6 py-12
          text-center

          dark:border-slate-700
        "
      >
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          No groups created yet
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Create groups to organize related inventory records.
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className="
          divide-y divide-slate-200
          overflow-hidden
          rounded-lg border
          border-slate-200

          dark:divide-slate-800
          dark:border-slate-800
        "
      >
        {groups.map((group) => (
          <div
            key={group.id}
            className="
              flex flex-col gap-4
              bg-white px-4 py-4

              dark:bg-slate-900

              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-slate-900 dark:text-slate-100">
                {group.group_name}
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {group.description || "No description provided."}
              </p>

              <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                Sort order: {group.sort_order}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button
                variant="secondary"
                onClick={() => onEdit(group)}
                className="flex items-center gap-2"
              >
                <Pencil size={15} />
                Edit
              </Button>

              <Button
                variant="danger"
                onClick={() => requestDelete(group)}
                className="flex items-center gap-2"
              >
                <Trash2 size={15} />
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(groupToDelete)}
        title="Delete Group"
        description={`Are you sure you want to delete "${groupToDelete?.group_name ?? ""}"?\n\nRecords currently assigned to this group will be moved to "No Group".`}
        confirmText="Delete Group"
        loading={deleteMutation.isPending}
        loadingText="Deleting..."
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </>
  );
}
