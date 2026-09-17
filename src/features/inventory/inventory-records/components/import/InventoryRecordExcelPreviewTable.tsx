import { Trash2 } from "lucide-react";

import type { AccountColumn } from "@/features/inventory/account-columns";

import type { Group, PreviewRow } from "../../types";

import { Button } from "@/components/ui";

import { FormSelect } from "@/components/form";

type Props = {
  rows: PreviewRow[];

  setRows: React.Dispatch<React.SetStateAction<PreviewRow[]>>;

  columns: AccountColumn[];
  groups: Group[];

  mapping: Record<string, string>;
};

export default function InventoryRecordExcelPreviewTable({
  rows,
  setRows,
  columns,
  groups,
  mapping,
}: Props) {
  function removeRow(id: string) {
    setRows((previous) => previous.filter((row) => row.id !== id));
  }

  function updateGroup(id: string, groupId: string) {
    setRows((previous) =>
      previous.map((row) =>
        row.id === id
          ? {
              ...row,

              group_id: groupId === "" ? null : Number(groupId),
            }
          : row,
      ),
    );
  }

  const reverseMapping = Object.fromEntries(
    Object.entries(mapping).map(([excelColumn, fieldKey]) => [
      fieldKey,
      excelColumn,
    ]),
  );

  return (
    <div
      className="
        max-h-112
        overflow-auto
        rounded-lg border
        border-slate-200
        bg-white

        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <table className="min-w-full text-sm">
        <thead className="sticky top-0 z-10">
          <tr
            className="
              border-b border-slate-200
              bg-slate-50
              text-xs font-semibold
              uppercase tracking-wide
              text-slate-500

              dark:border-slate-800
              dark:bg-slate-800
              dark:text-slate-400
            "
          >
            <th className="min-w-48 px-4 py-3 text-left">Group</th>

            {columns.map((column) => (
              <th
                key={column.id}
                className="min-w-48 whitespace-nowrap px-4 py-3 text-left"
              >
                {column.label}
              </th>
            ))}

            <th className="w-20 px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {rows.map((row) => (
            <tr
              key={row.id}
              className="
                bg-white
                transition-colors
                hover:bg-slate-50

                dark:bg-slate-900
                dark:hover:bg-slate-800/50
              "
            >
              <td className="px-4 py-3 align-top">
                <FormSelect
                  value={row.group_id === null ? "" : String(row.group_id)}
                  onChange={(value) => updateGroup(row.id, value)}
                  options={[
                    {
                      value: "",
                      label: "No Group",
                    },
                    ...groups.map((group) => ({
                      value: String(group.id),
                      label: group.group_name,
                    })),
                  ]}
                />
              </td>

              {columns.map((column) => {
                const excelColumn = reverseMapping[column.field_key];

                const value = excelColumn ? row.data[excelColumn] : "";

                return (
                  <td
                    key={column.id}
                    className="
                        max-w-64
                        px-4 py-3
                        align-top
                        text-slate-700
                        dark:text-slate-300
                      "
                  >
                    <div className="truncate" title={String(value ?? "")}>
                      {String(value ?? "")}
                    </div>
                  </td>
                );
              })}

              <td className="px-4 py-3 text-center align-top">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeRow(row.id)}
                  aria-label="Remove record"
                  className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <Trash2 size={16} />
                </Button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 2}
                className="px-6 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
              >
                No records to preview.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
