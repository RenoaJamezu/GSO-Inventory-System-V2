import type { AccountColumn } from "@/features/inventory/account-columns";
import type { Group, PreviewRow } from "../../types";

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
    setRows((prev) => prev.filter((row) => row.id !== id));
  }

  function updateGroup(id: string, groupId: string) {
    setRows((prev) =>
      prev.map((row) =>
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
    <div className="rounded-xl border border-gray-100 shadow-sm bg-white overflow-auto max-h-102">
      <table className="w-full table-fixed text-sm">
        <thead className="sticky top-0 z-10 bg-gray-100">
          <tr>
            <th className="w-40 p-2 border border-gray-400">Group</th>

            {columns.map((col) => (
              <th key={col.id} className="w-60 p-2 border border-gray-400 text-left">
                {col.label}
              </th>
            ))}

            <th className="w-28 p-2 border border-gray-400">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {/* Group */}
              <td className="p-2 border border-gray-400">
                <select
                  value={row.group_id ?? ""}
                  onChange={(e) => updateGroup(row.id, e.target.value)}
                  className="w-full rounded border border-gray-400 p-1"
                >
                  <option value="">No Group</option>

                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.group_name}
                    </option>
                  ))}
                </select>
              </td>

              {/* Data */}
              {columns.map((col) => (
                <td key={col.id} className="p-2 border border-gray-400">
                  {String(row.data[reverseMapping[col.field_key]] ?? "")}
                </td>
              ))}

              {/* Actions */}
              <td className="p-2 border border-gray-400 text-center">
                <button
                  onClick={() => removeRow(row.id)}
                  className="text-red-600 hover:underline"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 3}
                className="p-6 text-center text-gray-500"
              >
                No rows to preview
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
