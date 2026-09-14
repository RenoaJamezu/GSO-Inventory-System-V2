import { useState } from "react";
import { FolderPlus } from "lucide-react";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { Button } from "@/components/ui";

import InventoryRecordGroupCard from "./InventoryRecordGroupCard";
import InventoryRecordGroupDialog from "./InventoryRecordGroupDialog";

import type { Group } from "../../types";

import { useInventoryRecordGroups } from "../../hooks/useInventoryRecordGroups";

type Props = {
  open: boolean;
  accountId: number;
  onClose: () => void;
};

export default function InventoryRecordGroupManagementDialog({
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
        <DialogHeader title="Manage Groups">
          <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
            Organize inventory records into logical groups.
          </p>
        </DialogHeader>

        <DialogBody>
          <div className="space-y-5">
            <div
              className="
                flex flex-col
                gap-3
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Inventory Groups
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Groups help organize related records within this account.
                </p>
              </div>

              <Button onClick={createGroup} className="flex items-center gap-2">
                <FolderPlus size={16} />
                Add Group
              </Button>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                Loading groups...
              </div>
            ) : (
              <InventoryRecordGroupCard groups={groups} onEdit={editGroup} />
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </Dialog>

      <InventoryRecordGroupDialog
        open={dialogOpen}
        accountId={accountId}
        group={editingGroup}
        onClose={closeGroupDialog}
      />
    </>
  );
}
