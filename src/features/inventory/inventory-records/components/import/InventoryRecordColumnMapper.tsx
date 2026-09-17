import { WandSparkles } from "lucide-react";

import type { AccountColumn } from "@/features/inventory/account-columns";

import { Button } from "@/components/ui";
import { FormSelect } from "@/components/form";

import { createAutoMapping } from "../../utils/createAutoMapping";

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
  function handleAutoMap() {
    setMapping(createAutoMapping(excelColumns, systemColumns));
  }

  const mappedFields = new Set(Object.values(mapping).filter(Boolean));

  const unmappedRequired = systemColumns.filter(
    (column) => column.is_required && !mappedFields.has(column.field_key),
  );

  const sortedSystemColumns = [...systemColumns].sort((a, b) => {
    if (a.display_order !== b.display_order) {
      return a.display_order - b.display_order;
    }

    return a.id - b.id;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          type="button"
          variant="secondary"
          onClick={handleAutoMap}
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
          {excelColumns.map((excelColumn) => (
            <div
              key={excelColumn}
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
                  {excelColumn}
                </p>
              </div>

              <div>
                <p className="mb-1 text-xs font-medium text-slate-500 dark:text-slate-400 sm:hidden">
                  Inventory Field
                </p>

                <FormSelect
                  value={mapping[excelColumn] ?? ""}
                  options={[
                    {
                      value: "",
                      label: "Ignore Column",
                    },

                    ...sortedSystemColumns.map((column) => {
                      const currentField = mapping[excelColumn];

                      const alreadyMapped =
                        mappedFields.has(column.field_key) &&
                        currentField !== column.field_key;

                      return {
                        value: column.field_key,
                        label: alreadyMapped
                          ? `${column.label} (Already mapped)`
                          : column.label,
                        disabled: alreadyMapped,
                      };
                    }),
                  ]}
                  onChange={(value) =>
                    setMapping((previous) => ({
                      ...previous,
                      [excelColumn]: value,
                    }))
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
