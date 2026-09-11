import type { ReactNode } from "react";

import type { VehicleRecord } from "../../types";

import { formatVehicleDate } from "../../utils/formatVehicleDate";

import {
  getVehicleExpirationStatus,
  getVehicleExpirationStatusLabel,
} from "../../utils/getVehicleExpirationStatus";

type Props = {
  vehicle: VehicleRecord;
};

type FieldProps = {
  label: string;
  children: ReactNode;
};

function VehicleField({ label, children }: FieldProps) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </p>

      <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
        <p className="wrap-break-word text-sm text-gray-900">{children}</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b px-6 py-6 last:border-b-0">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </h3>

      <div className="space-y-5">{children}</div>
    </section>
  );
}

export default function VehicleRecordFields({ vehicle }: Props) {
  const expirationStatus = getVehicleExpirationStatus(vehicle.expiration_date);

  return (
    <>
      <Section title="Vehicle Information">
        <VehicleField label="Model">{vehicle.model || "—"}</VehicleField>

        <VehicleField label="Engine No.">
          {vehicle.engine_no || "—"}
        </VehicleField>

        <VehicleField label="Chassis No.">
          {vehicle.chassis_no || "—"}
        </VehicleField>

        <VehicleField label="Plate No.">{vehicle.plate_no || "—"}</VehicleField>
      </Section>

      <Section title="Assignment Information">
        <VehicleField label="Office">{vehicle.office || "—"}</VehicleField>

        <VehicleField label="M.R. / Memorandum Receipt">
          {vehicle.memorandum_receipt || "—"}
        </VehicleField>

        <VehicleField label="Driver">{vehicle.driver || "—"}</VehicleField>

        <VehicleField label="Cellphone No.">
          {vehicle.cellphone_no || "—"}
        </VehicleField>
      </Section>

      <Section title="Property Information">
        <VehicleField label="Property No.">
          {vehicle.property_no || "—"}
        </VehicleField>

        <VehicleField label="Date Acquired">
          {formatVehicleDate(vehicle.date_acquired)}
        </VehicleField>

        <VehicleField label="Cost">
          {formatVehicleCost(vehicle.cost)}
        </VehicleField>
      </Section>

      <Section title="Registration Information">
        <VehicleField label="Date Expiration">
          {formatVehicleDate(vehicle.expiration_date)}
        </VehicleField>

        <VehicleField label="Expiration Status">
          <ExpirationStatus status={expirationStatus} />
        </VehicleField>
      </Section>
    </>
  );
}

function formatVehicleCost(value: number | null) {
  if (value === null) {
    return "—";
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(value);
}

function ExpirationStatus({
  status,
}: {
  status: ReturnType<typeof getVehicleExpirationStatus>;
}) {
  const label = getVehicleExpirationStatusLabel(status);

  const className =
    status === "EXPIRED"
      ? "text-red-600"
      : status === "EXPIRING_SOON"
        ? "text-amber-600"
        : status === "VALID"
          ? "text-emerald-700"
          : "text-gray-500";

  return <span className={`font-medium ${className}`}>{label}</span>;
}
