import { WandSparkles } from "lucide-react";

import type { AccountColumn } from "@/features/inventory/account-columns";

import { Button } from "@/components/ui";
import { FormSelect } from "@/components/form";

import { normalize } from "../../utils/normalize";

type Props = {
  excelColumns: string[];
  systemColumns: AccountColumn[];
  mapping: Record<string, string>;

  setMapping: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

export default function InventoryRecordColumnMapper({
  excelColumns,
  systemColumns,
  mapping,
  setMapping,
}: Props) {
  function autoMap() {
    const auto: Record<string, string> = {};

    const used = new Set<string>();

    excelColumns.forEach((excelCol) => {
      const matched = systemColumns.find(
        (column) =>
          normalize(column.label) === normalize(excelCol) &&
          !used.has(column.field_key),
      );

      if (matched) {
        auto[excelCol] = matched.field_key;

        used.add(matched.field_key);
      }
    });

    setMapping(auto);
  }

  const unmappedRequired = systemColumns.filter(
    (column) =>
      column.is_required && !Object.values(mapping).includes(column.field_key),
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={autoMap}
          className="flex items-center gap-2"
        >
          <WandSparkles size={16} />
          Auto Map
        </Button>
      </div>

      {unmappedRequired.length > 0 && (
        <div
          className="
            rounded-md border
            border-red-200
            bg-red-50
            px-4 py-3

            dark:border-red-900
            dark:bg-red-950/30
          "
        >
          <p className="text-sm font-medium text-red-700 dark:text-red-300">
            Required fields are not mapped
          </p>

          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-600 dark:text-red-400">
            {unmappedRequired.map((column) => (
              <li key={column.id}>{column.label}</li>
            ))}
          </ul>
        </div>
      )}

      <div
        className="
          overflow-hidden rounded-lg
          border border-slate-200
          dark:border-slate-800
        "
      >
        <div
          className="
            hidden grid-cols-2 gap-4
            border-b border-slate-200
            bg-slate-50
            px-4 py-3
            text-xs font-semibold
            uppercase tracking-wide
            text-slate-500

            dark:border-slate-800
            dark:bg-slate-800/50
            dark:text-slate-400

            sm:grid
          "
        >
          <span>Excel Column</span>
          <span>Inventory Field</span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {excelColumns.map((excelCol) => (
            <div
              key={excelCol}
              className="
                  grid gap-2
                  bg-white px-4 py-3

                  dark:bg-slate-900

                  sm:grid-cols-2
                  sm:items-center
                  sm:gap-4
                "
            >
              <div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 sm:hidden">
                  Excel Column
                </p>

                <p className="mt-0.5 text-sm font-medium text-slate-800 dark:text-slate-200">
                  {excelCol}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400 sm:hidden">
                  Inventory Field
                </p>

                <FormSelect
                  value={mapping[excelCol] ?? ""}
                  onChange={(event) =>
                    setMapping((previous) => ({
                      ...previous,

                      [excelCol]: event.target.value,
                    }))
                  }
                >
                  <option value="">Ignore Column</option>

                  {systemColumns
                    .slice()
                    .sort((a, b) => a.display_order - b.display_order)
                    .map((column) => {
                      const alreadyMapped = Object.entries(mapping).some(
                        ([mappedExcelColumn, mappedField]) =>
                          mappedExcelColumn !== excelCol &&
                          mappedField === column.field_key,
                      );

                      return (
                        <option
                          key={column.id}
                          value={column.field_key}
                          disabled={alreadyMapped}
                        >
                          {column.label}
                          {alreadyMapped ? " (Already mapped)" : ""}
                        </option>
                      );
                    })}
                </FormSelect>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
