import { Pencil } from "lucide-react";

import { Button } from "@/components/ui";

import type { VehicleRecord } from "../types";

import { formatVehicleDate } from "../utils/formatVehicleDate";

import {
  getVehicleExpirationStatus,
  getVehicleExpirationStatusLabel,
} from "../utils/getVehicleExpirationStatus";
import { PERMISSIONS, usePermissions } from "@/features/auth";

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
  const { can } = usePermissions();

  const canEdit = can(PERMISSIONS.VEHICLE_UPDATE);
  return (
    <div
      className="
        overflow-hidden
        rounded-lg border
        border-slate-200
        bg-white

        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="max-h-[42rem] overflow-auto">
        <table className="min-w-[1100px] w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr
              className="
                border-b
                border-slate-200
                bg-slate-50
                text-xs
                font-semibold
                uppercase
                tracking-wide
                text-slate-500

                dark:border-slate-800
                dark:bg-slate-800
                dark:text-slate-400
              "
            >
              <th className="whitespace-nowrap px-4 py-3 text-left">
                Plate No.
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left">Model</th>

              <th className="whitespace-nowrap px-4 py-3 text-left">Office</th>

              <th className="whitespace-nowrap px-4 py-3 text-left">Driver</th>

              <th className="whitespace-nowrap px-4 py-3 text-left">
                Expiration
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-left">Status</th>

              <th className="whitespace-nowrap px-4 py-3 text-left">
                Property No.
              </th>

              <th className="whitespace-nowrap px-4 py-3 text-right">Cost</th>

              {canEdit && (
                <th className="w-16 px-3 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              )}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {vehicles.length === 0 ? (
              <tr>
                <td
                  colSpan={canEdit ? 9 : 8}
                  className="
                    px-6 py-16
                    text-center
                  "
                >
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                    No vehicle records found
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Try adjusting the search or expiration filters.
                  </p>
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
                    className="
                        cursor-pointer
                        bg-white
                        transition-colors
                        hover:bg-slate-50

                        dark:bg-slate-900
                        dark:hover:bg-slate-800/50
                      "
                  >
                    <td className="whitespace-nowrap px-4 py-3.5">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {vehicle.plate_no || "—"}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300">
                      {vehicle.model || "—"}
                    </td>

                    <td className="px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300">
                      {vehicle.office || "—"}
                    </td>

                    <td className="px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300">
                      {vehicle.driver || "—"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300">
                      {formatVehicleDate(vehicle.expiration_date)}
                    </td>

                    <td className="px-4 py-3.5">
                      <StatusBadge status={status} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-sm text-slate-700 dark:text-slate-300">
                      {vehicle.property_no || "—"}
                    </td>

                    <td className="whitespace-nowrap px-4 py-3.5 text-right text-sm font-medium tabular-nums text-slate-800 dark:text-slate-200">
                      {formatCost(vehicle.cost)}
                    </td>

                    {canEdit && (
                      <td
                        className="px-3 py-2 text-center"
                        onClick={(event) => event.stopPropagation()}
                      >
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditVehicle(vehicle)}
                          aria-label={`Edit vehicle ${vehicle.plate_no}`}
                        >
                          <Pencil size={16} />
                        </Button>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
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
      ? `
          border-red-200
          bg-red-50
          text-red-700

          dark:border-red-900
          dark:bg-red-950/40
          dark:text-red-300
        `
      : status === "EXPIRING_SOON"
        ? `
            border-amber-200
            bg-amber-50
            text-amber-700

            dark:border-amber-900
            dark:bg-amber-950/40
            dark:text-amber-300
          `
        : status === "VALID"
          ? `
              border-emerald-200
              bg-emerald-50
              text-emerald-700

              dark:border-emerald-900
              dark:bg-emerald-950/40
              dark:text-emerald-300
            `
          : `
              border-slate-200
              bg-slate-100
              text-slate-600

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-300
            `;

  return (
    <span
      className={`
        inline-flex
        whitespace-nowrap
        rounded-full
        border
        px-2.5 py-1
        text-xs font-medium
        ${className}
      `}
    >
      {label}
    </span>
  );
}
