import { Fragment } from "react";
import { Link } from "react-router-dom";

import type { AccountColumn } from "@/features/account-columns";
import type { Group } from "@/features/groups";

import { useDeleteInventoryRecord } from "../hooks/useInventoryRecords";
import type { InventoryRecord } from "../types";

type Props = {
  columns: AccountColumn[];
  records: InventoryRecord[];
  groups: Group[];

  selectedIds: number[];
  onSelectionChange: (ids: number[]) => void;

  onEdit: (record: InventoryRecord) => void;
};

export default function InventoryRecordsTable({
  columns,
  records,
  groups,
  selectedIds,
  onSelectionChange,
  onEdit,
}: Props) {
  const deleteMutation = useDeleteInventoryRecord();

  const handleDelete = (record: InventoryRecord) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this record?",
    );

    if (!confirmed) return;

    deleteMutation.mutate({
      id: record.id,
      account_id: record.account_id,
    });
  };

  const toggleRecord = (id: number) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((x) => x !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  const toggleAll = () => {
    if (selectedIds.length === records.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(records.map((r) => r.id));
    }
  };

  const sections = [
    {
      id: "no-group",
      title: "No Group",
      records: records.filter((record) => record.group_id === null),
    },

    ...groups
      .slice()
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((group) => ({
        id: group.id,
        title: group.group_name,
        records: records.filter((record) => record.group_id === group.id),
      }))
      .filter((section) => section.records.length > 0),
  ];

  return (
    <div className="overflow-x-auto rounded border">
      <table className="min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-center">
              <input
                type="checkbox"
                checked={
                  records.length > 0 && selectedIds.length === records.length
                }
                onChange={toggleAll}
              />
            </th>

            {columns.map((column) => (
              <th key={column.id} className="border px-4 py-2 text-left">
                {column.label}
              </th>
            ))}

            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {records.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + 2}
                className="border px-4 py-8 text-center text-gray-500"
              >
                No records found.
              </td>
            </tr>
          ) : (
            sections.map((section) => (
              <Fragment key={section.id}>
                <tr className="bg-gray-100">
                  <td
                    colSpan={columns.length + 2}
                    className="border px-4 py-2 font-semibold"
                  >
                    {section.title}
                  </td>
                </tr>

                {section.records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="border px-4 py-2 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(record.id)}
                        onChange={() => toggleRecord(record.id)}
                      />
                    </td>

                    {columns.map((column) => (
                      <td key={column.id} className="border px-4 py-2">
                        {renderCell(
                          record.data[column.field_key],
                          column.data_type,
                        )}
                      </td>
                    ))}

                    <td className="border px-4 py-2">
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/record/${record.qr_uuid}`}
                          target="_blank"
                          className="rounded bg-green-600 px-3 py-1 text-sm text-white"
                        >
                          QR
                        </Link>

                        <Link
                          to={`/print/${record.qr_uuid}`}
                          target="_blank"
                          className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
                        >
                          Print
                        </Link>

                        <button
                          onClick={() => onEdit(record)}
                          className="rounded bg-yellow-500 px-3 py-1 text-sm text-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(record)}
                          disabled={deleteMutation.isPending}
                          className="rounded bg-red-600 px-3 py-1 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function renderCell(value: unknown, type: string) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  switch (type) {
    case "boolean":
      return value ? "Yes" : "No";

    case "number":
      return Number(value).toLocaleString();

    case "date": {
      const date = new Date(String(value));

      if (Number.isNaN(date.getTime())) {
        return String(value);
      }

      return date.toLocaleDateString();
    }

    default:
      return String(value);
  }
}
