import { GripVertical } from "lucide-react";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import type { InventoryTableRow } from "../table-layout";
import type { InventoryRecord } from "../types";
import { renderFieldValue } from "../utils/renderFieldValue";

interface Props {
  row: InventoryTableRow;
  selected: boolean;
  isReordering: boolean;
  isDragDisabled: boolean;
  onSelect: (id: number) => void;
  onOpenRecord: (record: InventoryRecord) => void;
}

function checkboxClassName(): string {
  return [
    "h-4 w-4 rounded",
    "border-slate-300",
    "text-emerald-700",
    "focus:ring-2",
    "focus:ring-emerald-600/20",
    "dark:border-slate-600",
    "dark:bg-slate-800",
    "dark:text-emerald-500",
    "dark:focus:ring-emerald-500/20",
  ].join(" ");
}

export default function SortableInventoryRecordRow({
  row,
  selected,
  isReordering,
  isDragDisabled,
  onSelect,
  onOpenRecord,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: row.id,
    disabled: isReordering || isDragDisabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      onClick={() => onOpenRecord(row.record)}
      className={[
        "cursor-pointer",
        "text-sm text-slate-700",
        "transition-colors",
        "dark:text-slate-300",
        isDragging
          ? [
              "relative z-20",
              "bg-emerald-50",
              "shadow-sm",
              "dark:bg-emerald-950/30",
            ].join(" ")
          : selected
            ? ["bg-emerald-50/70", "dark:bg-emerald-950/30"].join(" ")
            : [
                "bg-white",
                "hover:bg-slate-50",
                "dark:bg-slate-900",
                "dark:hover:bg-slate-800/50",
              ].join(" "),
      ].join(" ")}
    >
      <td
        className="w-12 px-2 py-3 text-center"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          {...attributes}
          {...listeners}
          disabled={isReordering || isDragDisabled}
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
            disabled:opacity-30
            dark:text-slate-500
            dark:hover:bg-slate-800
            dark:hover:text-slate-200
          "
          aria-label={
            isDragDisabled
              ? "Record reordering is unavailable while records are filtered"
              : `Reorder record ${row.rowNumber}`
          }
        >
          <GripVertical size={17} />
        </button>
      </td>

      <td
        className="w-12 px-3 py-3"
        onClick={(event) => event.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(row.id)}
          className={checkboxClassName()}
          aria-label={`Select record ${row.rowNumber}`}
        />
      </td>

      <td className="w-16 whitespace-nowrap px-4 py-3 text-center font-medium text-slate-500 dark:text-slate-400">
        {row.rowNumber}
      </td>

      {row.cells.map((cell) => (
        <td
          key={cell.columnId}
          className="
            max-w-64
            truncate
            whitespace-nowrap
            px-4 py-3
            text-sm
            text-slate-700
            dark:text-slate-300
          "
          title={String(cell.value ?? "")}
        >
          {renderFieldValue(cell.value, cell.dataType, {
            isAmountColumn: cell.isAmountColumn,
          })}
        </td>
      ))}
    </tr>
  );
}
