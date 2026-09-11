import { Pencil } from "lucide-react";

import type { VehicleRecord } from "../types";

import { formatVehicleDate } from "../utils/formatVehicleDate";

import {
  getVehicleExpirationStatus,
  getVehicleExpirationStatusLabel,
} from "../utils/getVehicleExpirationStatus";

type Props = {
  vehicles: VehicleRecord[];

  onOpenVehicle: (vehicle: VehicleRecord) => void;

  onEditVehicle: (vehicle: VehicleRecord) => void;
};

export default function VehicleRecordsTable({
  vehicles,
  onOpenVehicle,
  onEditVehicle,
}: Props) {
  return (
    <div className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full border-collapse">
        <thead className="sticky top-0 z-10 bg-gray-100 uppercase">
          <tr className="text-sm font-semibold text-gray-700">
            <th className="whitespace-nowrap border-b border-gray-700 px-4 py-3 text-left">
              Plate No.
            </th>

            <th className="whitespace-nowrap border-b border-gray-700 px-4 py-3 text-left">
              Model
            </th>

            <th className="whitespace-nowrap border-b border-gray-700 px-4 py-3 text-left">
              Office
            </th>

            <th className="whitespace-nowrap border-b border-gray-700 px-4 py-3 text-left">
              Driver
            </th>

            <th className="whitespace-nowrap border-b border-gray-700 px-4 py-3 text-left">
              Expiration
            </th>

            <th className="whitespace-nowrap border-b border-gray-700 px-4 py-3 text-left">
              Status
            </th>

            <th className="whitespace-nowrap border-b border-gray-700 px-4 py-3 text-left">
              Property No.
            </th>

            <th className="whitespace-nowrap border-b border-gray-700 px-4 py-3 text-right">
              Cost
            </th>

            <th className="w-20 border-b border-gray-700 px-4 py-3 text-center">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="uppercase">
          {vehicles.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-14 text-center text-gray-500">
                No vehicle records found.
              </td>
            </tr>
          ) : (
            vehicles.map((vehicle) => {
              const status = getVehicleExpirationStatus(
                vehicle.expiration_date,
              );

              return (
                <tr
                  key={vehicle.id}
                  onClick={() => onOpenVehicle(vehicle)}
                  className="cursor-pointer border-b border-gray-300 transition-colors hover:bg-emerald-50"
                >
                  <td className="whitespace-nowrap px-4 py-3 font-semibold text-emerald-700">
                    {vehicle.plate_no}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                    {vehicle.model}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                    {vehicle.office ?? "—"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                    {vehicle.driver ?? "—"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                    {formatVehicleDate(vehicle.expiration_date)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm">
                    <StatusBadge status={status} />
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                    {vehicle.property_no ?? "—"}
                  </td>

                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-700">
                    {formatCost(vehicle.cost)}
                  </td>

                  <td
                    className="px-4 py-3 text-center"
                    onClick={(event) => event.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => onEditVehicle(vehicle)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-emerald-700"
                      aria-label={`Edit ${vehicle.plate_no}`}
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

function formatCost(value: number | null) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}

function StatusBadge({
  status,
}: {
  status: ReturnType<typeof getVehicleExpirationStatus>;
}) {
  const label = getVehicleExpirationStatusLabel(status);

  const className =
    status === "EXPIRED"
      ? "bg-red-50 text-red-700"
      : status === "EXPIRING_SOON"
        ? "bg-amber-50 text-amber-700"
        : status === "VALID"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-100 text-gray-600";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}
