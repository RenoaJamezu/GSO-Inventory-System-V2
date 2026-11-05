import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

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

import {
  buildHeaderRows,
  type InventoryTableColumn,
  type InventoryTableLayout,
  type InventoryTableRow,
} from "../table-layout";

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

type SortDirection = "asc" | "desc";

interface InventorySort {
  columnId: number;
  direction: SortDirection;
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

function getComparableValue(
  value: unknown,
  column: InventoryTableColumn,
): string | number | boolean | null {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  switch (column.dataType) {
    case "number": {
      if (typeof value === "number") {
        return Number.isFinite(value) ? value : null;
      }

      const normalized = String(value).replace(/,/g, "").trim();

      if (!normalized) return null;

      const number = Number(normalized);

      return Number.isFinite(number) ? number : null;
    }

    case "date": {
      const timestamp = new Date(String(value)).getTime();

      return Number.isNaN(timestamp) ? null : timestamp;
    }

    case "boolean": {
      if (typeof value === "boolean") return value;

      const normalized = String(value).toLowerCase().trim();

      if (["true", "1", "yes"].includes(normalized)) return true;
      if (["false", "0", "no"].includes(normalized)) return false;

      return null;
    }

    default:
      return String(value).trim();
  }
}

function compareRows(
  first: InventoryTableRow,
  second: InventoryTableRow,
  column: InventoryTableColumn,
  direction: SortDirection,
): number {
  const firstValue = getComparableValue(
    first.record.data[column.fieldKey],
    column,
  );

  const secondValue = getComparableValue(
    second.record.data[column.fieldKey],
    column,
  );

  // Keep empty values at the bottom in both directions.
  if (firstValue === null && secondValue === null) return 0;
  if (firstValue === null) return 1;
  if (secondValue === null) return -1;

  const result =
    typeof firstValue === "number" && typeof secondValue === "number"
      ? firstValue - secondValue
      : typeof firstValue === "boolean" && typeof secondValue === "boolean"
        ? Number(firstValue) - Number(secondValue)
        : String(firstValue).localeCompare(String(secondValue), undefined, {
            numeric: true,
            sensitivity: "base",
          });

  if (result === 0) {
    return (
      first.record.sort_order - second.record.sort_order || first.id - second.id
    );
  }

  return direction === "asc" ? result : -result;
}

function SortIcon({ direction }: { direction: SortDirection | null }) {
  if (direction === "asc") {
    return <ArrowUp size={14} />;
  }

  if (direction === "desc") {
    return <ArrowDown size={14} />;
  }

  return <ArrowUpDown size={14} />;
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

  const [sort, setSort] = useState<InventorySort | null>(null);

  const selectedSet = new Set(selectedIds);

  const allSelected =
    layout.visibleRecordIds.length > 0 &&
    layout.visibleRecordIds.every((id) => selectedSet.has(id));

  const isSorting = sort !== null;

  const displayGroups = useMemo(() => {
    let rowNumber = 1;

    return layout.groups.map((group) => {
      const rows = [...group.rows];

      if (sort) {
        const column = layout.columns.find((item) => item.id === sort.columnId);

        if (column) {
          rows.sort((first, second) =>
            compareRows(first, second, column, sort.direction),
          );
        }
      }

      return {
        ...group,
        rows: rows.map((row) => ({
          ...row,
          rowNumber: rowNumber++,
        })),
      };
    });
  }, [layout.groups, layout.columns, sort]);

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

  function handleSort(columnId: number) {
    setSort((current) => {
      if (!current || current.columnId !== columnId) {
        return {
          columnId,
          direction: "asc",
        };
      }

      if (current.direction === "asc") {
        return {
          columnId,
          direction: "desc",
        };
      }

      return null;
    });
  }

  function renderHeader(cell: {
    label: string;
    columnId?: number;
    isGroup: boolean;
  }) {
    if (cell.isGroup || cell.columnId === undefined) {
      return cell.label;
    }

    const direction = sort?.columnId === cell.columnId ? sort.direction : null;

    const nextDirection =
      direction === null
        ? "ascending"
        : direction === "asc"
          ? "descending"
          : "default order";

    return (
      <button
        type="button"
        onClick={() => handleSort(cell.columnId!)}
        className="
          inline-flex items-center gap-2
          rounded-sm text-left
          transition-colors
          hover:text-emerald-700
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-emerald-600/30
          dark:hover:text-emerald-400
        "
        aria-label={`Sort ${cell.label}: ${nextDirection}`}
        title={`Sort by ${cell.label}`}
      >
        <span>{cell.label}</span>

        <span
          className={
            direction
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-slate-400 dark:text-slate-500"
          }
        >
          <SortIcon direction={direction} />
        </span>
      </button>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (
      isDragDisabled ||
      isSorting ||
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
                  {renderHeader(cell)}
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
                    className="
                      whitespace-nowrap
                      px-4 py-3
                      text-left align-middle
                    "
                  >
                    {renderHeader(cell)}
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
                  className="
                    px-6 py-14
                    text-center text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  No inventory records found.
                </td>
              </tr>
            ) : (
              displayGroups.map((group) => {
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
                          isDragDisabled={isDragDisabled || isSorting}
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
