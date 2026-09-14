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

type VehicleFieldProps = {
  label: string;
  children: ReactNode;
};

type SectionProps = {
  title: string;
  children: ReactNode;
};

function VehicleField({ label, children }: VehicleFieldProps) {
  return (
    <div
      className="
        grid gap-1
        py-3

        sm:grid-cols-[150px_minmax(0,1fr)]
        sm:gap-4
      "
    >
      <dt
        className="
          text-xs font-medium
          uppercase tracking-wide
          text-slate-500

          dark:text-slate-400
        "
      >
        {label}
      </dt>

      <dd
        className="
          wrap-break-word
          text-sm
          text-slate-900

          dark:text-slate-100
        "
      >
        {children}
      </dd>
    </div>
  );
}

function Section({ title, children }: SectionProps) {
  return (
    <section
      className="
        border-b
        border-slate-200
        px-6 py-5
        last:border-b-0

        dark:border-slate-800
      "
    >
      <h3
        className="
          mb-2
          text-xs font-semibold
          uppercase tracking-wide
          text-slate-500

          dark:text-slate-400
        "
      >
        {title}
      </h3>

      <dl
        className="
          divide-y
          divide-slate-100

          dark:divide-slate-800
        "
      >
        {children}
      </dl>
    </section>
  );
}

export default function VehicleRecordFields({ vehicle }: Props) {
  const expirationStatus = getVehicleExpirationStatus(vehicle.expiration_date);

  return (
    <>
      <Section title="Vehicle Information">
        <VehicleField label="Model">{vehicle.model || "—"}</VehicleField>

        <VehicleField label="Plate No.">{vehicle.plate_no || "—"}</VehicleField>

        <VehicleField label="Engine No.">
          {vehicle.engine_no || "—"}
        </VehicleField>

        <VehicleField label="Chassis No.">
          {vehicle.chassis_no || "—"}
        </VehicleField>
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
        <VehicleField label="Expiration Date">
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
