import { Plus } from "lucide-react";

import { Button, SearchField } from "@/components/ui";
import { FormSelect } from "@/components/form";

import { PERMISSIONS, usePermissions } from "@/features/auth";

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
  const { can } = usePermissions();

  const canCreate = can(PERMISSIONS.VEHICLE_CREATE);

  return (
    <section
      className="
        rounded-lg border
        border-slate-200
        bg-white
        p-4

        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div
        className="
          flex flex-col gap-3

          xl:flex-row
          xl:items-center
          xl:justify-between
        "
      >
        <div className="w-full xl:max-w-xl">
          <SearchField
            value={search}
            onChange={onSearchChange}
            placeholder="Search plate, model, office, driver..."
          />
        </div>

        <div
          className="
            grid grid-cols-1 gap-2

            sm:grid-cols-2

            lg:grid-cols-4

            xl:flex
            xl:shrink-0
            xl:items-center
          "
        >
          <FormSelect
            value={year}
            options={[
              {
                value: "",
                label: "All Years",
              },
              ...years.map((year) => ({
                value: String(year),
                label: String(year),
              })),
            ]}
            onChange={onYearChange}
            className="w-full lg:min-w-32 xl:w-32"
          />

          <FormSelect
            value={month}
            options={[
              {
                value: "",
                label: "All Months",
              },
              ...VEHICLE_EXPIRATION_MONTHS.map((month) => ({
                value: month.value,
                label: month.label,
              })),
            ]}
            onChange={onMonthChange}
            className="w-full lg:min-w-36 xl:w-36"
          />

          <FormSelect
            value={sort}
            options={[
              {
                value: "PLATE_ASC",
                label: "Plate A-Z",
              },
              {
                value: "PLATE_DESC",
                label: "Plate Z-A",
              },
              {
                value: "EXPIRATION_ASC",
                label: "Expiration: Earliest",
              },
              {
                value: "EXPIRATION_DESC",
                label: "Expiration: Latest",
              },
              {
                value: "ACQUIRED_ASC",
                label: "Acquired: Oldest",
              },
              {
                value: "ACQUIRED_DESC",
                label: "Acquired: Newest",
              },
              {
                value: "COST_ASC",
                label: "Cost: Lowest",
              },
              {
                value: "COST_DESC",
                label: "Cost: Highest",
              },
            ]}
            onChange={(value) => onSortChange(value as VehicleSortOption)}
            className="w-full lg:min-w-44 xl:w-44"
          />

          {canCreate && (
            <Button
              onClick={onAdd}
              className="
                flex w-full
                items-center justify-center gap-2
                whitespace-nowrap
                xl:w-auto
              "
            >
              <Plus size={17} />
              Add Vehicle
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
