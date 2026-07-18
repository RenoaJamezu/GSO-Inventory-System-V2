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
      className="h-4 w-4 rounded border-gray-300 text-emerald-600"
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
  const visibleIds = groupedRecords.flatMap((g) => g.records.map((r) => r.id));

  const allSelected =
    visibleIds.length > 0 && visibleIds.every((id) => selectedSet.has(id));

  const numberedRecords = groupedRecords.flatMap((group) =>
    group.records.map((record) => record),
  );

  const rowNumbers = new Map(
    numberedRecords.map((record, index) => [record.id, index + 1]),
  );

  return (
    <div className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-gray-100 uppercase">
          <tr className="text-sm font-semibold text-gray-700">
            <th className="w-12 border-b border-gray-700 px-4 py-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={() => onSelectAll(visibleIds)}
              />
            </th>

            <th className="w-16 border-b border-gray-700 px-4 py-3 text-center font-semibold">
              #
            </th>

            {columns.map((column) => (
              <th
                key={column.id}
                className="whitespace-nowrap border-b border-gray-700 px-4 py-3 text-left font-semibold text-gray-700"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {visibleIds.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 2}
                className="py-14 text-center text-gray-500"
              >
                No inventory records found.
              </td>
            </tr>
          ) : (
            groupedRecords.map((group) => {
              const ids = group.records.map((r) => r.id);

              return (
                <Fragment key={`group-${group.id ?? "none"}`}>
                  <tr
                    className="cursor-pointer border-b border-gray-300 bg-gray-100 transition-colors hover:bg-gray-200"
                    onClick={() => onToggleGroup(ids)}
                  >
                    <td
                      className="w-12 px-4 py-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GroupCheckbox
                        ids={ids}
                        checked={isGroupSelected(ids)}
                        indeterminate={isGroupIndeterminate(ids)}
                        onChange={onToggleGroup}
                      />
                    </td>

                    <td
                      colSpan={columns.length + 1}
                      className="px-4 py-2 font-semibold text-gray-700"
                    >
                      {group.name}

                      <span className="ml-2 text-sm font-normal text-gray-500">
                        ({group.records.length})
                      </span>
                    </td>
                  </tr>

                  {group.records.map((record) => (
                    <tr
                      key={record.id}
                      onClick={() => onOpenRecord(record)}
                      className={[
                        "cursor-pointer border-b border-gray-300 px-4 py-3 transition-colors hover:bg-emerald-50",
                        selectedSet.has(record.id) ? "bg-emerald-50/60" : "",
                      ].join(" ")}
                    >
                      <td
                        className="w-12 px-4 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSet.has(record.id)}
                          onChange={() => onSelect(record.id)}
                          className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                        />
                      </td>

                      <td className="w-16 whitespace-nowrap px-4 py-3 font-medium text-gray-700">
                        {rowNumbers.get(record.id) ?? 0}
                      </td>

                      {columns.map((column) => (
                        <td
                          key={column.id}
                          className="max-w-55 truncate px-6 py-3 text-sm text-gray-700"
                          title={String(record.data[column.field_key] ?? "")}
                        >
                          {renderFieldValue(
                            record.data[column.field_key],
                            column.data_type,
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
