import type { AccountColumn } from "@/features/inventory/account-columns/types";

import { renderFieldValue } from "../../utils/renderFieldValue";

type Props = {
  columns: AccountColumn[];
  data: Record<string, unknown>;
};

export default function InventoryRecordFields({ columns, data }: Props) {
  return (
    <section className="px-6 py-6">
      <div className="mb-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Record Information
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Information stored for this inventory record.
        </p>
      </div>

      {columns.length === 0 ? (
        <div
          className="
            rounded-md border
            border-dashed
            border-slate-300
            px-4 py-8
            text-center

            dark:border-slate-700
          "
        >
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No account fields configured.
          </p>
        </div>
      ) : (
        <dl
          className="
            divide-y divide-slate-100
            rounded-lg border
            border-slate-200

            dark:divide-slate-800
            dark:border-slate-800
          "
        >
          {columns.map((column) => {
            const value = data[column.field_key];

            return (
              <div key={column.id} className="px-4 py-3.5">
                <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {column.label}
                </dt>

                <dd className="mt-1 wrap-break-word text-sm font-medium text-slate-900 dark:text-slate-100">
                  {renderFieldValue(value, column.data_type)}
                </dd>
              </div>
            );
          })}
        </dl>
      )}
    </section>
  );
}
