import type { AccountColumn } from "@/features/account-columns";
import { normalize } from "../utils/normalize";

type Props = {
  excelColumns: string[];
  systemColumns: AccountColumn[];
  mapping: Record<string, string>;
  setMapping: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

export default function ColumnMapper({
  excelColumns,
  systemColumns,
  mapping,
  setMapping,
}: Props) {
  function autoMap() {
    const auto: Record<string, string> = {};

    excelColumns.forEach((excelCol) => {
      const matched = systemColumns.find(
        (col) => normalize(col.label) === normalize(excelCol),
      );

      if (matched) {
        auto[excelCol] = matched.field_key;
      }
    });

    setMapping(auto);
  }

  const unmappedRequired = systemColumns.filter(
    (col) => col.is_required && !Object.values(mapping).includes(col.field_key),
  );

  return (
    <div className="rounded-xl border p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Column Mapping</h2>

        <button
          type="button"
          onClick={autoMap}
          className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
        >
          Auto Map
        </button>
      </div>

      {unmappedRequired.length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Missing required fields:
          <ul className="mt-1 list-disc pl-5">
            {unmappedRequired.map((col) => (
              <li key={col.id}>{col.label}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="space-y-3">
        {excelColumns.map((excelCol) => (
          <div key={excelCol} className="grid grid-cols-2 gap-4 items-center">
            <div className="font-medium text-gray-700">{excelCol}</div>

            <select
              value={mapping[excelCol] ?? ""}
              onChange={(e) =>
                setMapping((prev) => ({
                  ...prev,
                  [excelCol]: e.target.value,
                }))
              }
              className="rounded border p-2"
            >
              <option value="">Ignore Column</option>

              {systemColumns
                .slice()
                .sort((a, b) => a.display_order - b.display_order)
                .map((col) => (
                  <option key={col.id} value={col.field_key}>
                    {col.label}
                  </option>
                ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
