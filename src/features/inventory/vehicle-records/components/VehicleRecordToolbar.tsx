import { Plus } from "lucide-react";

import { Button, SearchField } from "@/components/ui";

import { FormSelect } from "@/components/form";

import { VEHICLE_EXPIRATION_MONTHS } from "../constants";

import type { VehicleSortOption } from "../hooks/useVehicleRecordFilters";

type Props = {
  search: string;
  onSearchChange: (value: string) => void;

  year: string;
  onYearChange: (value: string) => void;

  month: string;
  onMonthChange: (value: string) => void;

  sort: VehicleSortOption;
  onSortChange: (value: VehicleSortOption) => void;

  years: number[];

  onAdd: () => void;
};

export default function VehicleRecordToolbar({
  search,
  onSearchChange,

  year,
  onYearChange,

  month,
  onMonthChange,

  sort,
  onSortChange,

  years,

  onAdd,
}: Props) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="w-full xl:max-w-md">
          <SearchField
            value={search}
            onChange={onSearchChange}
            placeholder="Search vehicle records..."
          />
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <FormSelect
            value={year}
            onChange={(event) => onYearChange(event.target.value)}
            className="sm:w-36"
          >
            <option value="">All Years</option>

            {years.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            value={month}
            onChange={(event) => onMonthChange(event.target.value)}
            className="sm:w-40"
          >
            <option value="">All Months</option>

            {VEHICLE_EXPIRATION_MONTHS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </FormSelect>

          <FormSelect
            value={sort}
            onChange={(event) =>
              onSortChange(event.target.value as VehicleSortOption)
            }
            className="sm:w-56"
          >
            <option value="PLATE_ASC">Plate A-Z</option>

            <option value="PLATE_DESC">Plate Z-A</option>

            <option value="EXPIRATION_ASC">Expiration: Earliest</option>

            <option value="EXPIRATION_DESC">Expiration: Latest</option>

            <option value="ACQUIRED_ASC">Acquired: Oldest</option>

            <option value="ACQUIRED_DESC">Acquired: Newest</option>

            <option value="COST_ASC">Cost: Lowest</option>

            <option value="COST_DESC">Cost: Highest</option>
          </FormSelect>

          <Button onClick={onAdd}>
            <Plus size={16} />
            Add Vehicle
          </Button>
        </div>
      </div>
    </section>
  );
}
