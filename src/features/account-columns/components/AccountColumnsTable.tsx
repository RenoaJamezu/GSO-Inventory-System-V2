import { Button } from "@/components/ui";
import type { AccountColumn } from "../types";

type Props = {
  columns: AccountColumn[];
  onEdit: (column: AccountColumn) => void;
  onDelete: (column: AccountColumn) => void;
};

const DATA_TYPE_LABELS: Record<string, string> = {
  text: "Text",
  textarea: "Textarea",
  number: "Number",
  date: "Date",
  boolean: "Boolean",
};

export default function AccountColumnsTable({
  columns,
  onEdit,
  onDelete,
}: Props) {
  if (columns.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
        <h3 className="text-lg font-semibold text-gray-800">No Columns Yet</h3>

        <p className="mt-2 max-w-md text-sm text-gray-500">
          Create your first column to define what information should be stored
          for this inventory account.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="max-h-162.5 overflow-auto">
        <table className="min-w-full border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-100">
            <tr className="text-xs font-semibold text-gray-700 uppercase">
              <th className="w-16 border-b border-gray-200 px-4 py-3 text-center">
                #
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-left">
                Label
              </th>

              <th className="border-b border-gray-200 px-4 py-3 text-left">
                Field Key
              </th>

              <th className="w-40 border-b border-gray-200 px-4 py-3 text-center">
                Type
              </th>

              <th className="w-36 border-b border-gray-200 px-4 py-3 text-center">
                Required
              </th>

              <th className="w-36 border-b border-gray-200 px-4 py-3 text-center">
                Amount
              </th>

              <th className="w-44 border-b border-gray-200 px-4 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {columns.map((column, index) => (
              <tr
                key={column.id}
                className="border-b transition-colors hover:bg-gray-50"
              >
                <td className="border-b border-gray-100 px-4 py-3 text-center text-sm font-medium text-gray-500">
                  {index + 1}
                </td>

                <td className="border-b border-gray-100 px-4 py-3">
                  <div className="font-medium text-gray-900">
                    {column.label}
                  </div>

                  {column.description && (
                    <div className="mt-1 text-xs border-b border-gray-100 px-4 py-3 text-gray-500">
                      {column.description}
                    </div>
                  )}
                </td>

                <td className="border-b border-gray-100 px-4 py-3">
                  <code className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-700">
                    {column.field_key}
                  </code>
                </td>

                <td className="border-b border-gray-100 px-4 py-3 text-center">
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                    {DATA_TYPE_LABELS[column.data_type]}
                  </span>
                </td>

                <td className="border-b border-gray-100 px-4 py-3 text-center">
                  {column.is_required ? (
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Required
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      Optional
                    </span>
                  )}
                </td>

                <td className="border-b border-gray-100 px-4 py-3 text-center">
                  {column.is_amount_column ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                      Amount
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </td>

                <td className="border-b border-gray-100 px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => onEdit(column)}
                    >
                      Edit
                    </Button>

                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => onDelete(column)}
                    >
                      Delete
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
