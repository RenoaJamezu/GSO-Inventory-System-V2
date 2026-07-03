import type { Group } from "@/features/groups";
import type { AccountColumn } from "@/features/account-columns";

type PreviewRow = {
  id: string;
  group_id: number | null;
  data: Record<string, unknown>;
};

type Props = {
  rows: PreviewRow[];
  setRows: React.Dispatch<React.SetStateAction<PreviewRow[]>>;
  columns: AccountColumn[];
  groups: Group[];
  mapping: Record<string, string>;
};

export default function ExcelPreviewTable({
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
    <div className="rounded-xl border overflow-auto max-h-105">
      <table className="table-fixed min-w-full text-sm">
        <thead className="bg-gray-100 sticky top-0">
          <tr>
            <th className="p-2 border w-30">Group</th>

            {columns.map((col) => (
              <th key={col.id} className="p-2 border text-left">
                {col.label}
              </th>
            ))}

            <th className="p-2 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {/* Group */}
              <td className="p-2 border">
                <select
                  value={row.group_id ?? ""}
                  onChange={(e) => updateGroup(row.id, e.target.value)}
                  className="w-full rounded border p-1"
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
                <td key={col.id} className="p-2 border">
                  {String(row.data[reverseMapping[col.field_key]] ?? "")}
                </td>
              ))}

              {/* Actions */}
              <td className="p-2 border text-center">
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
