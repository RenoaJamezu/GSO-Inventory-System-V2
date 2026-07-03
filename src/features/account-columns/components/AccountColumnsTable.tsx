import type { AccountColumn } from "../types";

type Props = {
  columns: AccountColumn[];
  onEdit: (column: AccountColumn) => void;
  onDelete: (column: AccountColumn) => void;
};

export default function AccountColumnsTable({
  columns,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="overflow-x-auto rounded border">
      <table className="table-fixed min-w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2 text-center">No.</th>
            <th className="border px-4 py-2 text-left">Label</th>
            <th className="border px-4 py-2 text-left">Field Key</th>
            <th className="border px-4 py-2 text-center">Type</th>
            <th className="border px-4 py-2 text-center">Required</th>
            <th className="border px-4 py-2 text-center">Amount</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {columns.length === 0 && (
            <tr>
              <td
                colSpan={7}
                className="border px-4 py-8 text-center text-gray-500"
              >
                No columns found.
              </td>
            </tr>
          )}

          {columns.map((column, index) => (
            <tr key={column.id} className="hover:bg-gray-50">
              <td className="border px-4 py-2 text-center">{index + 1}</td>
              <td className="border px-4 py-2">{column.label}</td>
              <td className="border px-4 py-2">{column.field_key}</td>
              <td className="border px-4 py-2 text-center capitalize">
                {column.data_type}
              </td>
              <td className="border px-4 py-2 text-center">
                {column.is_required ? "Yes" : "No"}
              </td>
              <td className="border px-4 py-2 text-center">
                {column.is_amount_column ? "Yes" : "No"}
              </td>
              <td className="border px-4 py-2 text-center">
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => onEdit(column)}
                    className="rounded bg-yellow-500 px-3 py-1 text-sm text-white hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(column)}
                    className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
