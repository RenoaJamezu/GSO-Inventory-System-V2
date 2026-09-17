import { Fragment, useEffect, useRef } from "react";

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

import type { InventoryRecord, InventoryType } from "../types";

import { buildHeaderRows, type InventoryTableLayout } from "../table-layout";

import { useReorderInventoryRecords } from "../hooks/useInventoryRecords";

import SortableInventoryRecordRow from "./SortableInventoryRecordRow";

interface InventoryRecordTableProps {
  layout: InventoryTableLayout;

  accountId: number;
  inventoryType: InventoryType;

  isDragDisabled?: boolean;

  selectedIds: number[];

  onSelect: (id: number) => void;
  onSelectAll: (ids: number[]) => void;

  onToggleGroup: (ids: number[]) => void;

  isGroupSelected: (ids: number[]) => boolean;

  isGroupIndeterminate: (ids: number[]) => boolean;

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

interface GroupCheckboxProps {
  ids: number[];
  checked: boolean;
  indeterminate: boolean;

  onChange: (ids: number[]) => void;
}

function GroupCheckbox({
  ids,
  checked,
  indeterminate,
  onChange,
}: GroupCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <input
      ref={ref}
      type="checkbox"
      checked={checked}
      onChange={() => onChange(ids)}
      className={checkboxClassName()}
    />
  );
}

export default function InventoryRecordTable({
  layout,
  accountId,
  inventoryType,
  isDragDisabled = false,
  selectedIds,
  onSelect,
  onSelectAll,
  onToggleGroup,
  isGroupSelected,
  isGroupIndeterminate,
  onOpenRecord,
}: InventoryRecordTableProps) {
  const reorderMutation = useReorderInventoryRecords();

  const selectedSet = new Set(selectedIds);

  const allSelected =
    layout.visibleRecordIds.length > 0 &&
    layout.visibleRecordIds.every((id) => selectedSet.has(id));

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

    if (
      isDragDisabled ||
      reorderMutation.isPending ||
      !over ||
      active.id === over.id
    ) {
      return;
    }

    const activeRow = layout.rows.find((row) => row.id === active.id);

    const overRow = layout.rows.find((row) => row.id === over.id);

    if (!activeRow || !overRow) {
      return;
    }

    if (activeRow.groupId !== overRow.groupId) {
      return;
    }

    const group = layout.groups.find((item) => item.id === activeRow.groupId);

    if (!group) {
      return;
    }

    const oldIndex = group.rows.findIndex((row) => row.id === active.id);

    const newIndex = group.rows.findIndex((row) => row.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    const reorderedRows = arrayMove(group.rows, oldIndex, newIndex);

    const availableSortOrders = group.rows
      .map((row) => row.record.sort_order)
      .sort((firstOrder, secondOrder) => firstOrder - secondOrder);

    reorderMutation.mutate({
      accountId,
      inventoryType,
      groupId: activeRow.groupId,

      records: reorderedRows.map((row, index) => ({
        id: row.id,

        sort_order: availableSortOrders[index] ?? index,
      })),
    });
  }

  const headerRows = buildHeaderRows({
    columns: layout.columns,
    headerGroups: layout.headerGroups,
  });

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div
        className="
          overflow-auto
          rounded-lg border
          border-slate-200
          bg-white
          dark:border-slate-800
          dark:bg-slate-900
        "
      >
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
              <th
                rowSpan={headerRows.hasGroups ? 2 : 1}
                className="w-12 px-2 py-3 align-middle"
              >
                <span className="sr-only">Reorder</span>
              </th>

              <th
                rowSpan={headerRows.hasGroups ? 2 : 1}
                className="w-12 px-3 py-3 align-middle"
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => onSelectAll(layout.visibleRecordIds)}
                  className={checkboxClassName()}
                  aria-label="Select all records"
                />
              </th>

              <th
                rowSpan={headerRows.hasGroups ? 2 : 1}
                className="w-16 px-4 py-3 text-center align-middle"
              >
                No.
              </th>

              {headerRows.top.map((cell) => (
                <th
                  key={cell.key}
                  colSpan={cell.colSpan}
                  rowSpan={cell.rowSpan}
                  className={
                    cell.isGroup
                      ? "whitespace-nowrap border-b border-slate-200 px-4 py-2.5 text-center align-middle dark:border-slate-700"
                      : "whitespace-nowrap px-4 py-3 text-left align-middle"
                  }
                >
                  {cell.label}
                </th>
              ))}
            </tr>

            {headerRows.hasGroups && (
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
                {headerRows.bottom.map((cell) => (
                  <th
                    key={cell.key}
                    className="whitespace-nowrap px-4 py-3 text-left align-middle"
                  >
                    {cell.label}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {layout.recordCount === 0 ? (
              <tr>
                <td
                  colSpan={layout.columnCount + 3}
                  className="px-6 py-14 text-center text-sm text-slate-500 dark:text-slate-400"
                >
                  No inventory records found.
                </td>
              </tr>
            ) : (
              layout.groups.map((group) => {
                const ids = group.rows.map((row) => row.id);

                return (
                  <Fragment key={`group-${group.id ?? "none"}`}>
                    <tr
                      onClick={() => onToggleGroup(ids)}
                      className="
                          cursor-pointer
                          border-y border-slate-200
                          bg-slate-100/80
                          transition-colors
                          hover:bg-slate-200/70
                          dark:border-slate-800
                          dark:bg-slate-800/70
                          dark:hover:bg-slate-800
                        "
                    >
                      <td className="w-12 px-2 py-2.5" />

                      <td
                        className="w-12 px-3 py-2.5"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <GroupCheckbox
                          ids={ids}
                          checked={isGroupSelected(ids)}
                          indeterminate={isGroupIndeterminate(ids)}
                          onChange={onToggleGroup}
                        />
                      </td>

                      <td
                        colSpan={layout.columnCount + 1}
                        className="px-4 py-2.5"
                      >
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {group.name}
                        </span>

                        <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                          {group.rows.length} record
                          {group.rows.length !== 1 ? "s" : ""}
                        </span>
                      </td>
                    </tr>

                    <SortableContext
                      items={group.rows.map((row) => row.id)}
                      strategy={verticalListSortingStrategy}
                    >
                      {group.rows.map((row) => (
                        <SortableInventoryRecordRow
                          key={row.id}
                          row={row}
                          selected={selectedSet.has(row.id)}
                          isReordering={reorderMutation.isPending}
                          isDragDisabled={isDragDisabled}
                          onSelect={onSelect}
                          onOpenRecord={onOpenRecord}
                        />
                      ))}
                    </SortableContext>
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </DndContext>
  );
}
