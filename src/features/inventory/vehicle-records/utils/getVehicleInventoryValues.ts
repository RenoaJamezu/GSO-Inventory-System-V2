import type { VehicleRecord } from "../types";

export type VehicleInventoryValues = {
  plateNumber: string;
  propertyNumber: string;
  unitValue: number | null;
  description: string;
  inventoryDate: string;
  inventoryType: string;
  isLinked: boolean;
};

export function getVehicleInventoryValues(
  vehicle: VehicleRecord,
): VehicleInventoryValues {
  const inventoryRecord = vehicle.inventory_record ?? null;
  const data = inventoryRecord?.data ?? {};

  return {
    plateNumber: inventoryRecord
      ? getString(data, "plate_number")
      : vehicle.plate_no || "",

    propertyNumber: inventoryRecord
      ? getString(data, "property_number")
      : vehicle.property_no || "",

    unitValue: inventoryRecord ? getNumber(data, "unit_value") : vehicle.cost,

    description: inventoryRecord ? getString(data, "description") : "",

    inventoryDate: inventoryRecord ? getString(data, "date") : "",

    inventoryType: inventoryRecord?.inventory_type ?? "",

    isLinked: inventoryRecord !== null,
  };
}

function getString(data: Record<string, unknown>, key: string): string {
  const value = data[key];

  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function getNumber(data: Record<string, unknown>, key: string): number | null {
  const value = data[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(/,/g, ""));

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}
