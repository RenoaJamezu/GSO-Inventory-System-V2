import type { AccountColumn } from "@/features/account-columns/types";
import { renderFieldValue } from "../../utils/renderFieldValue";

type Props = {
  columns: AccountColumn[];
  data: Record<string, unknown>;
};

export default function InventoryRecordFields({ columns, data }: Props) {
  return (
    <section className="px-6 py-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        Asset Information
      </h3>

      <div className="space-y-5">
        {columns.map((column) => (
          <div key={column.id}>
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {column.label}
            </p>

            <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
              <p className="wrap-break-word text-sm text-gray-900">
                {renderFieldValue(data[column.field_key], column.data_type)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
