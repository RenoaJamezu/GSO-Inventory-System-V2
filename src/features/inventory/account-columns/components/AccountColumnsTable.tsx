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

import type { AccountColumn } from "../types";

import SortableAccountColumnRow from "./SortableAccountColumnRow";

interface AccountColumnsTableProps {
  columns: AccountColumn[];
  isReordering?: boolean;
  onReorder: (columns: AccountColumn[]) => void;
  onEdit: (column: AccountColumn) => void;
  onDelete: (column: AccountColumn) => void;
}

export default function AccountColumnsTable({
  columns,
  isReordering = false,
  onReorder,
  onEdit,
  onDelete,
}: AccountColumnsTableProps) {
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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id === over.id || isReordering) {
      return;
    }

    const oldIndex = columns.findIndex((column) => column.id === active.id);
    const newIndex = columns.findIndex((column) => column.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onReorder(arrayMove(columns, oldIndex, newIndex));
  }

  if (columns.length === 0) {
    return (
      <div className="px-6 py-14 text-center">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          No columns configured
        </h3>

        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Add a column to define what information should be stored for inventory
          records under this account.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={columns.map((column) => column.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="max-h-160 overflow-auto">
          <table className="min-w-full border-collapse">
            <thead className="sticky top-0 z-10">
              <tr
                className="
                  border-b border-slate-200
                  bg-slate-50
                  text-xs font-semibold
                  uppercase tracking-wide
                  text-slate-500
                  dark:border-slate-800
                  dark:bg-slate-800/60
                  dark:text-slate-400
                "
              >
                <th className="w-12 px-2 py-3">
                  <span className="sr-only">Reorder</span>
                </th>

                <th className="w-16 px-4 py-3 text-center">No.</th>
                <th className="px-4 py-3 text-left">Label</th>
                <th className="px-4 py-3 text-left">Field Key</th>
                <th className="w-36 px-4 py-3 text-left">Type</th>
                <th className="w-32 px-4 py-3 text-center">Required</th>
                <th className="w-32 px-4 py-3 text-center">Amount</th>

                <th className="w-16 px-4 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {columns.map((column, index) => (
                <SortableAccountColumnRow
                  key={column.id}
                  column={column}
                  index={index}
                  isReordering={isReordering}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      </SortableContext>
    </DndContext>
  );
}
