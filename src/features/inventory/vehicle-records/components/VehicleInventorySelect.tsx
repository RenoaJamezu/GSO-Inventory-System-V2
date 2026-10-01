import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search } from "lucide-react";

import type { MotorVehicleInventoryOption } from "../../inventory-records/types";

type Props = {
  value: number;
  options: MotorVehicleInventoryOption[];
  disabled?: boolean;
  onChange: (value: number) => void;
};

export default function VehicleInventorySelect({
  value,
  options,
  disabled = false,
  onChange,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedOption = options.find((option) => option.id === value) ?? null;

  const filteredOptions = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return options;
    }

    return options.filter((option) => {
      const data = option.data ?? {};

      const plate = getString(data, "plate_number");
      const property = getString(data, "property_number");
      const description = getString(data, "description");

      return [plate, property, description].some((field) =>
        field.toLowerCase().includes(query),
      );
    });
  }, [options, search]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  function handleSelect(option: MotorVehicleInventoryOption) {
    onChange(option.id);
    setSearch("");
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setOpen((current) => !current);
          }
        }}
        className="
          flex min-h-10 w-full items-center justify-between gap-3
          rounded-md border border-slate-300 bg-white px-3 py-2
          text-left text-sm text-slate-900
          outline-none
          focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600
          disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500

          dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100
          dark:disabled:bg-slate-900
        "
      >
        <span className="min-w-0 truncate">
          {selectedOption
            ? getOptionLabel(selectedOption)
            : "Select motor vehicle"}
        </span>

        <ChevronDown size={16} className="shrink-0 text-slate-500" />
      </button>

      {open && (
        <div
          className="
            absolute z-50 mt-1 w-full
            overflow-hidden rounded-md border border-slate-200
            bg-white shadow-lg

            dark:border-slate-700 dark:bg-slate-900
          "
        >
          <div className="border-b border-slate-200 p-2 dark:border-slate-700">
            <div className="relative">
              <Search
                size={16}
                className="
                  absolute left-3 top-1/2 -translate-y-1/2
                  text-slate-400
                "
              />

              <input
                autoFocus
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search plate, property, description..."
                className="
                  h-9 w-full rounded-md border border-slate-300
                  bg-white pl-9 pr-3 text-sm text-slate-900
                  outline-none
                  focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600

                  dark:border-slate-700 dark:bg-slate-950
                  dark:text-slate-100
                "
              />
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-6 text-center text-sm text-slate-500">
                No matching motor vehicle found.
              </div>
            ) : (
              filteredOptions.map((option) => {
                const data = option.data ?? {};
                const plate = getString(data, "plate_number");
                const property = getString(data, "property_number");
                const description = getString(data, "description");
                const selected = option.id === value;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className="
                      flex w-full items-start gap-3 rounded-md px-3 py-2
                      text-left
                      hover:bg-slate-100

                      dark:hover:bg-slate-800
                    "
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                        {plate || "No plate number"}
                      </div>

                      {(property || description) && (
                        <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                          {[property, description].filter(Boolean).join(" • ")}
                        </div>
                      )}
                    </div>

                    {selected && (
                      <Check
                        size={16}
                        className="mt-0.5 shrink-0 text-emerald-600"
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function getOptionLabel(option: MotorVehicleInventoryOption) {
  const data = option.data ?? {};

  const plate = getString(data, "plate_number");
  const property = getString(data, "property_number");
  const description = getString(data, "description");

  return (
    [plate, property, description].filter(Boolean).join(" • ") ||
    `Inventory #${option.id}`
  );
}

function getString(data: Record<string, unknown>, key: string) {
  const value = data[key];

  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}
