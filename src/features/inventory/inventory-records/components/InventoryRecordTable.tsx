import { Fragment, useEffect, useRef } from "react";

import type { AccountColumn } from "@/features/inventory/account-columns";
import type { InventoryRecord } from "../types";

import type { InventoryRecordGroup } from "../utils/groupInventoryRecords";

import { renderFieldValue } from "../utils/renderFieldValue";

type Props = {
  groupedRecords: InventoryRecordGroup[];
  columns: AccountColumn[];

  selectedIds: number[];

  onSelect: (id: number) => void;

  onSelectAll: (ids: number[]) => void;

  onToggleGroup: (ids: number[]) => void;

  isGroupSelected: (ids: number[]) => boolean;

  isGroupIndeterminate: (ids: number[]) => boolean;

  onOpenRecord: (record: InventoryRecord) => void;
};

function checkboxClassName() {
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

function GroupCheckbox({
  ids,
  checked,
  indeterminate,
  onChange,
}: {
  ids: number[];
  checked: boolean;
  indeterminate: boolean;
  onChange: (ids: number[]) => void;
}) {
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
  groupedRecords,
  columns,

  selectedIds,

  onSelect,
  onSelectAll,

  onToggleGroup,

  isGroupSelected,
  isGroupIndeterminate,

  onOpenRecord,
}: Props) {
  const selectedSet = new Set(selectedIds);

  const visibleIds = groupedRecords.flatMap((group) =>
    group.records.map((record) => record.id),
  );

  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id));

  const numberedRecords = groupedRecords.flatMap((group) => group.records);

  const rowNumbers = new Map(
    numberedRecords.map((record, index) => [record.id, index + 1]),
  );

  return (
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
            <th className="w-12 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onSelectAll(visibleIds)}
                className={checkboxClassName()}
                aria-label="Select all records"
              />
            </th>

            <th className="w-16 px-4 py-3 text-center">No.</th>

            {columns.map((column) => (
              <th
                key={column.id}
                className="whitespace-nowrap px-4 py-3 text-left"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {visibleIds.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 2}
                className="px-6 py-14 text-center text-sm text-slate-500 dark:text-slate-400"
              >
                No inventory records found.
              </td>
            </tr>
          ) : (
            groupedRecords.map((group) => {
              const ids = group.records.map((record) => record.id);

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
                    <td
                      className="w-12 px-4 py-2.5"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <GroupCheckbox
                        ids={ids}
                        checked={isGroupSelected(ids)}
                        indeterminate={isGroupIndeterminate(ids)}
                        onChange={onToggleGroup}
                      />
                    </td>

                    <td colSpan={columns.length + 1} className="px-4 py-2.5">
                      <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                        {group.name}
                      </span>

                      <span className="ml-2 text-xs font-normal text-slate-500 dark:text-slate-400">
                        {group.records.length} record
                        {group.records.length !== 1 ? "s" : ""}
                      </span>
                    </td>
                  </tr>

                  {group.records.map((record) => {
                    const selected = selectedSet.has(record.id);

                    return (
                      <tr
                        key={record.id}
                        onClick={() => onOpenRecord(record)}
                        className={[
                          "cursor-pointer",
                          "text-sm text-slate-700",
                          "transition-colors",
                          "dark:text-slate-300",

                          selected
                            ? [
                                "bg-emerald-50/70",
                                "dark:bg-emerald-950/30",
                              ].join(" ")
                            : [
                                "bg-white",
                                "hover:bg-slate-50",
                                "dark:bg-slate-900",
                                "dark:hover:bg-slate-800/50",
                              ].join(" "),
                        ].join(" ")}
                      >
                        <td
                          className="w-12 px-4 py-3"
                          onClick={(event) => event.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => onSelect(record.id)}
                            className={checkboxClassName()}
                            aria-label={`Select record ${rowNumbers.get(record.id) ?? ""}`}
                          />
                        </td>

                        <td className="w-16 whitespace-nowrap px-4 py-3 text-center font-medium text-slate-500 dark:text-slate-400">
                          {rowNumbers.get(record.id) ?? 0}
                        </td>

                        {columns.map((column) => (
                          <td
                            key={column.id}
                            className="
                                    max-w-64
                                    truncate
                                    whitespace-nowrap
                                    px-4 py-3
                                    text-sm
                                    text-slate-700
                                    dark:text-slate-300
                                  "
                            title={String(record.data[column.field_key] ?? "")}
                          >
                            {renderFieldValue(
                              record.data[column.field_key],
                              column.data_type,
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
