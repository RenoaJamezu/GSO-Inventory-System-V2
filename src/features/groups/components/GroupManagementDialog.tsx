import { useState } from "react";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import GroupDialog from "./GroupDialog";

import { useGroups, useDeleteGroup } from "../hooks/useGroups";

import type { Group } from "../types";

type Props = {
  open: boolean;
  accountId: number;
  onClose: () => void;
};

export default function GroupManagementDialog({
  open,
  accountId,
  onClose,
}: Props) {
  const { data: groups = [], isLoading } = useGroups(accountId);

  const deleteMutation = useDeleteGroup();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const handleCreate = () => {
    setSelectedGroup(null);
    setDialogOpen(true);
  };

  const handleEdit = (group: Group) => {
    setSelectedGroup(group);
    setDialogOpen(true);
  };

  const handleDelete = async (group: Group) => {
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
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedGroup(null);
  };

  if (!open) return null;

  return (
    <>
      <Dialog open={open} maxWidth="lg">
        <DialogHeader title="Manage Groups" />

        <DialogBody>
          <div className="mb-4 flex justify-end">
            <button
              onClick={handleCreate}
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              Add Group
            </button>
          </div>

          {isLoading ? (
            <div className="py-8 text-center">Loading...</div>
          ) : (
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-4 py-2 text-left">Group Name</th>

                  <th className="border px-4 py-2 text-left">Description</th>

                  <th className="border px-4 py-2 text-center">Order</th>

                  <th className="border px-4 py-2 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {groups.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="border px-4 py-8 text-center text-gray-500"
                    >
                      No groups found.
                    </td>
                  </tr>
                ) : (
                  groups.map((group) => (
                    <tr key={group.id}>
                      <td className="border px-4 py-2">{group.group_name}</td>

                      <td className="border px-4 py-2">
                        {group.description || "-"}
                      </td>

                      <td className="border px-4 py-2 text-center">
                        {group.sort_order}
                      </td>

                      <td className="border px-4 py-2">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(group)}
                            className="rounded bg-yellow-500 px-3 py-1 text-sm text-white"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(group)}
                            disabled={deleteMutation.isPending}
                            className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </DialogBody>

        <DialogFooter>
          <button onClick={onClose} className="rounded border px-4 py-2">
            Close
          </button>
        </DialogFooter>
      </Dialog>

      <GroupDialog
        open={dialogOpen}
        accountId={accountId}
        group={selectedGroup}
        onClose={handleDialogClose}
      />
    </>
  );
}
