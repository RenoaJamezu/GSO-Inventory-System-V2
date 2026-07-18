import { useState } from "react";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { Button } from "@/components/ui";
import InventoryRecordGroupCard from "./InventoryRecordGroupCard";
import InventoryGroupDialog from "./InventoryRecordGroupDialog";
import type { Group } from "../../types";
import { useInventoryRecordGroups } from "../../hooks/useInventoryRecordGroups";

type Props = {
  open: boolean;
  accountId: number;
  onClose: () => void;
};

export default function InventoryGroupManagementDialog({
  open,
  accountId,
  onClose,
}: Props) {
  const { data: groups = [], isLoading } = useInventoryRecordGroups(accountId);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  function createGroup() {
    setEditingGroup(null);
    setDialogOpen(true);
  }

  function editGroup(group: Group) {
    setEditingGroup(group);
    setDialogOpen(true);
  }

  function closeGroupDialog() {
    setEditingGroup(null);
    setDialogOpen(false);
  }

  if (!open) return null;

  return (
    <>
      <Dialog open={open} maxWidth="lg" onClose={onClose}>
        <DialogHeader title="Manage Groups" />

        <DialogBody>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Inventory Groups</h2>

              <p className="text-sm text-gray-500">
                Organize inventory records into groups.
              </p>
            </div>

            <Button onClick={createGroup}>Add Group</Button>
          </div>

          {isLoading ? (
            <div className="py-12 text-center">Loading groups...</div>
          ) : (
            <InventoryRecordGroupCard groups={groups} onEdit={editGroup} />
          )}
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      <InventoryGroupDialog
        open={dialogOpen}
        accountId={accountId}
        group={editingGroup}
        onClose={closeGroupDialog}
      />
    </>
  );
}
