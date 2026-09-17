import { GripVertical, Pencil, Trash2 } from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { Button } from "@/components/ui";

import type { Group } from "../../types";

type Props = {
  group: Group;
  index: number;

  isReordering: boolean;

  onEdit: (group: Group) => void;
  onDelete: (group: Group) => void;
};

export default function SortableInventoryRecordGroup({
  group,
  index,
  isReordering,
  onEdit,
  onDelete,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: group.id,
    disabled: isReordering,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        "flex flex-col gap-4 px-4 py-4",
        "transition-colors",
        "sm:flex-row sm:items-start sm:justify-between",

        isDragging
          ? [
              "relative z-20",
              "bg-emerald-50",
              "shadow-sm",
              "dark:bg-emerald-950/30",
            ].join(" ")
          : ["bg-white", "dark:bg-slate-900"].join(" "),
      ].join(" ")}
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={isReordering}
          className="
            mt-0.5
            inline-flex h-8 w-8
            shrink-0
            cursor-grab
            touch-none
            items-center justify-center
            rounded-md
            text-slate-400
            transition-colors

            hover:bg-slate-100
            hover:text-slate-700

            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-emerald-600/30

            active:cursor-grabbing

            disabled:cursor-not-allowed
            disabled:opacity-50

            dark:text-slate-500
            dark:hover:bg-slate-800
            dark:hover:text-slate-200
          "
          aria-label={`Reorder ${group.group_name}`}
        >
          <GripVertical size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium tabular-nums text-slate-400 dark:text-slate-500">
              {index + 1}.
            </span>

            <h3 className="truncate font-medium text-slate-900 dark:text-slate-100">
              {group.group_name}
            </h3>
          </div>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {group.description || "No description provided."}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="secondary"
          disabled={isReordering}
          onClick={() => onEdit(group)}
          className="flex items-center gap-2"
        >
          <Pencil size={15} />
          Edit
        </Button>

        <Button
          type="button"
          variant="danger"
          disabled={isReordering}
          onClick={() => onDelete(group)}
          className="flex items-center gap-2"
        >
          <Trash2 size={15} />
          Delete
        </Button>
      </div>
    </div>
  );
}
