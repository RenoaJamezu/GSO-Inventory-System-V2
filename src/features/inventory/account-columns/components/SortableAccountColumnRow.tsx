import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  CircleCheck,
  CircleDollarSign,
  Ellipsis,
  GripVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button, Dropdown } from "@/components/ui";

import { DATA_TYPES } from "../constants";
import type { AccountColumn } from "../types";

interface SortableAccountColumnRowProps {
  column: AccountColumn;
  index: number;
  isReordering: boolean;
  onEdit: (column: AccountColumn) => void;
  onDelete: (column: AccountColumn) => void;
}

export default function SortableAccountColumnRow({
  column,
  index,
  isReordering,
  onEdit,
  onDelete,
}: SortableAccountColumnRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    disabled: isReordering,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const dataTypeLabel =
    DATA_TYPES.find((dataType) => dataType.value === column.data_type)?.label ??
    column.data_type;

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={[
        "bg-white text-sm transition-colors dark:bg-slate-900",
        isDragging
          ? [
              "relative z-20",
              "bg-emerald-50",
              "shadow-sm",
              "dark:bg-emerald-950/30",
            ].join(" ")
          : ["hover:bg-slate-50", "dark:hover:bg-slate-800/50"].join(" "),
      ].join(" ")}
    >
      <td className="w-12 px-2 py-3.5 text-center">
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={isReordering}
          className="
            inline-flex h-8 w-8
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
          aria-label={`Reorder ${column.label}`}
        >
          <GripVertical size={18} />
        </button>
      </td>

      <td className="w-16 px-4 py-3.5 text-center text-slate-500 dark:text-slate-400">
        {index + 1}
      </td>

      <td className="px-4 py-3.5">
        <div>
          <p className="font-medium text-slate-900 dark:text-slate-100">
            {column.label}
          </p>

          {column.description && (
            <p className="mt-0.5 max-w-72 truncate text-xs text-slate-500 dark:text-slate-400">
              {column.description}
            </p>
          )}
        </div>
      </td>

      <td className="px-4 py-3.5">
        <code className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          {column.field_key}
        </code>
      </td>

      <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
        {dataTypeLabel}
      </td>

      <td className="px-4 py-3.5 text-center">
        {column.is_required ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <CircleCheck size={13} />
            Yes
          </span>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
        )}
      </td>

      <td className="px-4 py-3.5 text-center">
        {column.is_amount_column ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            <CircleDollarSign size={13} />
            Amount
          </span>
        ) : (
          <span className="text-sm text-slate-400 dark:text-slate-500">—</span>
        )}
      </td>

      <td className="w-16 px-3 py-2">
        <Dropdown>
          <Dropdown.Trigger>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={isReordering}
              aria-label={`Actions for ${column.label}`}
            >
              <Ellipsis size={18} />
            </Button>
          </Dropdown.Trigger>

          <Dropdown.Content>
            <Dropdown.Item onClick={() => onEdit(column)}>
              <Pencil size={16} />
              Edit Column
            </Dropdown.Item>

            <Dropdown.Item variant="danger" onClick={() => onDelete(column)}>
              <Trash2 size={16} />
              Delete Column
            </Dropdown.Item>
          </Dropdown.Content>
        </Dropdown>
      </td>
    </tr>
  );
}
