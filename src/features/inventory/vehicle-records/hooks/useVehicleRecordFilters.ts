import { useMemo, useState } from "react";

import type { VehicleRecord } from "../types";

export type VehicleSortOption =
  | "PLATE_ASC"
  | "PLATE_DESC"
  | "EXPIRATION_ASC"
  | "EXPIRATION_DESC"
  | "ACQUIRED_ASC"
  | "ACQUIRED_DESC"
  | "COST_ASC"
  | "COST_DESC";

type Params = {
  vehicles: VehicleRecord[];
};

export function useVehicleRecordFilters({ vehicles }: Params) {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [sort, setSort] = useState<VehicleSortOption>("PLATE_ASC");

  const years = useMemo(() => {
    const values = new Set<number>();

    vehicles.forEach((vehicle) => {
      if (!vehicle.expiration_date) return;

      const date = new Date(`${vehicle.expiration_date}T00:00:00`);

      if (!Number.isNaN(date.getTime())) {
        values.add(date.getFullYear());
      }
    });

    return Array.from(values).sort((a, b) => b - a);
  }, [vehicles]);

  const filteredVehicles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = vehicles.filter((vehicle) => {
      const matchesSearch =
        normalizedSearch === "" ||
        [
          vehicle.plate_no,
          vehicle.model,
          vehicle.engine_no,
          vehicle.chassis_no,
          vehicle.office,
          vehicle.driver,
          vehicle.property_no,
        ].some((value) => value?.toLowerCase().includes(normalizedSearch));

      if (!matchesSearch) {
        return false;
      }

      if (!year && !month) {
        return true;
      }

      if (!vehicle.expiration_date) {
        return false;
      }

      const expirationDate = new Date(`${vehicle.expiration_date}T00:00:00`);

      if (Number.isNaN(expirationDate.getTime())) {
        return false;
      }

      const matchesYear =
        !year || expirationDate.getFullYear() === Number(year);

      const matchesMonth =
        !month || expirationDate.getMonth() + 1 === Number(month);

      return matchesYear && matchesMonth;
    });

    return [...result].sort((a, b) => {
      switch (sort) {
        case "PLATE_DESC":
          return b.plate_no.localeCompare(a.plate_no);

        case "EXPIRATION_ASC":
          return compareNullableDates(a.expiration_date, b.expiration_date);

        case "EXPIRATION_DESC":
          return compareNullableDates(b.expiration_date, a.expiration_date);

        case "ACQUIRED_ASC":
          return compareNullableDates(a.date_acquired, b.date_acquired);

        case "ACQUIRED_DESC":
          return compareNullableDates(b.date_acquired, a.date_acquired);

        case "COST_ASC":
          return compareNullableNumbers(a.cost, b.cost);

        case "COST_DESC":
          return compareNullableNumbers(b.cost, a.cost);

        case "PLATE_ASC":
        default:
          return a.plate_no.localeCompare(b.plate_no);
      }
    });
  }, [vehicles, search, year, month, sort]);

  return {
    search,
    setSearch,

    year,
    setYear,

    month,
    setMonth,

    sort,
    setSort,

    years,
    filteredVehicles,
  };
}

function compareNullableDates(a: string | null, b: string | null) {
  if (!a && !b) return 0;
  if (!a) return 1;
  if (!b) return -1;

  return (
    new Date(`${a}T00:00:00`).getTime() - new Date(`${b}T00:00:00`).getTime()
  );
}

function compareNullableNumbers(a: number | null, b: number | null) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;

  return a - b;
}
