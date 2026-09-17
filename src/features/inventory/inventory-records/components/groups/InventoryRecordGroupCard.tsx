import { useState } from "react";

import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { ConfirmDialog } from "@/components/dialog";

import type { Group } from "../../types";

import {
  useDeleteGroup,
  useReorderGroups,
} from "../../hooks/useInventoryRecordGroups";

import SortableInventoryRecordGroup from "./SortableInventoryRecordGroup";

type Props = {
  groups: Group[];
  accountId: number;

  onEdit: (group: Group) => void;
};

export default function InventoryRecordGroupCard({
  groups,
  accountId,
  onEdit,
}: Props) {
  const deleteMutation = useDeleteGroup();
  const reorderMutation = useReorderGroups();

  const [groupToDelete, setGroupToDelete] = useState<Group | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),

    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function requestDelete(group: Group) {
    setGroupToDelete(group);
  }

  function closeDeleteDialog() {
    if (deleteMutation.isPending) {
      return;
    }

    setGroupToDelete(null);
  }

  async function confirmDelete() {
    if (!groupToDelete) {
      return;
    }

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (reorderMutation.isPending || !over || active.id === over.id) {
      return;
    }

    const oldIndex = groups.findIndex((group) => group.id === active.id);

    const newIndex = groups.findIndex((group) => group.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedGroups = arrayMove(groups, oldIndex, newIndex);

    reorderMutation.mutate({
      accountId,

      groups: reorderedGroups.map((group, index) => ({
        id: group.id,
        sort_order: index,
      })),
    });
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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={groups.map((group) => group.id)}
          strategy={verticalListSortingStrategy}
        >
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
            {groups.map((group, index) => (
              <SortableInventoryRecordGroup
                key={group.id}
                group={group}
                index={index}
                isReordering={reorderMutation.isPending}
                onEdit={onEdit}
                onDelete={requestDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

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
