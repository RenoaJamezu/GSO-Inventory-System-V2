import {
  CircleDollarSign,
  CircleCheck,
  Ellipsis,
  Pencil,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui";

import { Dropdown, DropdownItem } from "@/components/ui/dropdown";

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
      <div className="px-6 py-14 text-center">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
          No columns configured
        </h3>

        <p className="mx-auto mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
          Add a column to define what information should be stored for inventory
          records under this account.
        </p>
      </div>
    );
  }

  return (
    <div className="max-h-[40rem] overflow-auto">
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
            <th className="w-16 px-4 py-3 text-center">No.</th>

            <th className="px-4 py-3 text-left">Label</th>

            <th className="px-4 py-3 text-left">Field Key</th>

            <th className="w-36 px-4 py-3 text-left">Type</th>

            <th className="w-32 px-4 py-3 text-center">Required</th>

            <th className="w-32 px-4 py-3 text-center">Amount</th>

            <th className="w-16 px-4 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {columns.map((column, index) => (
            <tr
              key={column.id}
              className="
                  bg-white
                  text-sm
                  transition-colors
                  hover:bg-slate-50

                  dark:bg-slate-900
                  dark:hover:bg-slate-800/50
                "
            >
              <td className="px-4 py-3.5 text-center text-slate-500 dark:text-slate-400">
                {index + 1}
              </td>

              <td className="px-4 py-3.5">
                <div>
                  <p className="font-medium text-slate-900 dark:text-slate-100">
                    {column.label}
                  </p>

                  {column.description && (
                    <p className="mt-0.5 max-w-72 truncate text-xs text-slate-500 dark:text-slate-400">
                      {column.description}
                    </p>
                  )}
                </div>
              </td>

              <td className="px-4 py-3.5">
                <code
                  className="
                      rounded-md
                      bg-slate-100
                      px-2 py-1
                      text-xs
                      text-slate-700

                      dark:bg-slate-800
                      dark:text-slate-300
                    "
                >
                  {column.field_key}
                </code>
              </td>

              <td className="px-4 py-3.5 text-slate-700 dark:text-slate-300">
                {DATA_TYPE_LABELS[column.data_type] ?? column.data_type}
              </td>

              <td className="px-4 py-3.5 text-center">
                {column.is_required ? (
                  <span
                    className="
                        inline-flex
                        items-center gap-1
                        rounded-full
                        bg-slate-100
                        px-2 py-1
                        text-xs font-medium
                        text-slate-700

                        dark:bg-slate-800
                        dark:text-slate-300
                      "
                  >
                    <CircleCheck size={13} />
                    Yes
                  </span>
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500">
                    —
                  </span>
                )}
              </td>

              <td className="px-4 py-3.5 text-center">
                {column.is_amount_column ? (
                  <span
                    className="
                        inline-flex
                        items-center gap-1
                        rounded-full
                        bg-emerald-50
                        px-2 py-1
                        text-xs font-medium
                        text-emerald-700

                        dark:bg-emerald-950/40
                        dark:text-emerald-300
                      "
                  >
                    <CircleDollarSign size={13} />
                    Amount
                  </span>
                ) : (
                  <span className="text-sm text-slate-400 dark:text-slate-500">
                    —
                  </span>
                )}
              </td>

              <td className="px-3 py-2">
                <Dropdown
                  trigger={
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Actions for ${column.label}`}
                    >
                      <Ellipsis size={18} />
                    </Button>
                  }
                >
                  <DropdownItem onClick={() => onEdit(column)}>
                    <Pencil size={16} />
                    Edit Column
                  </DropdownItem>

                  <DropdownItem danger onClick={() => onDelete(column)}>
                    <Trash2 size={16} />
                    Delete Column
                  </DropdownItem>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
