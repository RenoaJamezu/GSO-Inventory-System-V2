import * as XLSX from "xlsx";

import { downloadWorkbook } from "@/features/inventory/export";

import type { VehicleRecord } from "../types";

export function exportVehicleRecords(vehicles: VehicleRecord[]) {
  if (vehicles.length === 0) {
    return;
  }

  const rows = vehicles.map((vehicle, index) => ({
    "No.": index + 1,
    Model: vehicle.model,
    "Engine Number": vehicle.engine_no ?? "",
    "Chassis Number": vehicle.chassis_no ?? "",
    Office: vehicle.office ?? "",
    "Memorandum Receipt": vehicle.memorandum_receipt ?? "",
    Driver: vehicle.driver ?? "",
    "Cellphone Number": vehicle.cellphone_no ?? "",
    "Expiration Date": vehicle.expiration_date ?? "",
    "Date Acquired": vehicle.date_acquired ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);

  worksheet["!cols"] = [
    { wch: 6 },
    { wch: 28 },
    { wch: 22 },
    { wch: 22 },
    { wch: 28 },
    { wch: 24 },
    { wch: 28 },
    { wch: 20 },
    { wch: 18 },
    { wch: 18 },
  ];

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicle Records");

  downloadWorkbook(workbook, "Vehicle Records.xlsx");
}
