import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";

import type { InventoryType } from "@/features/inventory/inventory-records";

import { usePublicInventoryRecord } from "../hooks/usePublicRecord";
import { renderPublicValue } from "../utils/renderPublicView";

function getInventoryTypeLabel(inventoryType: InventoryType) {
  switch (inventoryType) {
    case "PAR":
      return "Property Acknowledgment Receipt";

    case "HIGH_COST":
      return "High Cost";

    case "LOW_COST":
      return "Low Cost";
  }
}

function PublicRecordStatus({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md border border-slate-200 bg-white p-8 text-center">
        <img
          src="/images/sibagat-logo.png"
          alt="Municipality of Sibagat logo"
          className="mx-auto h-16 w-16 object-contain"
        />

        <h1 className="mt-5 text-lg font-semibold text-slate-900">{title}</h1>

        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </main>
  );
}

export default function PublicInventoryRecordPage() {
  const { uuid } = useParams();

  const {
    data: record,
    isLoading,
    error,
  } = usePublicInventoryRecord(uuid ?? "");

  if (isLoading) {
    return (
      <PublicRecordStatus
        title="Loading Inventory Record"
        description="Please wait while the public inventory information is being retrieved."
      />
    );
  }

  if (error) {
    return (
      <PublicRecordStatus
        title="Unable to Load Record"
        description="The inventory record could not be loaded. Please try again later."
      />
    );
  }

  if (!record) {
    return (
      <PublicRecordStatus
        title="Inventory Record Not Found"
        description="This QR code does not correspond to an available inventory record."
      />
    );
  }

  const qrUrl = `${window.location.origin}/public/${encodeURIComponent(
    record.qr_uuid,
  )}`;

  const sortedColumns = [...record.columns].sort(
    (a, b) => a.display_order - b.display_order,
  );

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b-4 border-emerald-700 bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-5 sm:px-6">
          <img
            src="/images/sibagat-logo.png"
            alt="Municipality of Sibagat logo"
            className="h-14 w-14 object-contain sm:h-16 sm:w-16"
          />

          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Republic of the Philippines
            </p>

            <h1 className="mt-0.5 text-base font-bold uppercase text-slate-900 sm:text-lg">
              Municipality of Sibagat
            </h1>

            <p className="text-sm font-medium text-emerald-700">
              General Services Office
            </p>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 sm:py-8">
        <section className="border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="w-fit shrink-0 border border-slate-200 bg-white p-3">
                <QRCode
                  value={qrUrl}
                  size={112}
                  aria-label="QR code for this public inventory record"
                />
              </div>

              <div className="min-w-0 flex-1">
                <span className="inline-flex border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-800">
                  {getInventoryTypeLabel(record.inventory_type)}
                </span>

                <h2 className="mt-3 wrap-break-word text-xl font-bold text-slate-900 sm:text-2xl">
                  {record.account_title}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Public Inventory Record
                </p>

                {record.group_name && (
                  <p className="mt-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-700">Group:</span>{" "}
                    {record.group_name}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-200">
            {sortedColumns.length > 0 ? (
              sortedColumns.map((column) => (
                <div
                  key={column.field_key}
                  className="grid gap-1 px-5 py-4 sm:grid-cols-[14rem_minmax(0,1fr)] sm:gap-6 sm:px-6"
                >
                  <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {column.label}
                  </dt>

                  <dd className="wrap-break-word text-sm font-medium text-slate-900">
                    {renderPublicValue(
                      record.data[column.field_key],
                      column.data_type,
                    )}
                  </dd>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-slate-500 sm:px-6">
                No public inventory fields are available for this record.
              </div>
            )}
          </div>

          <footer className="border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
            <p className="text-xs leading-5 text-slate-500">
              This is a read-only public inventory record maintained by the
              General Services Office of the Municipality of Sibagat. For
              corrections or inquiries regarding this record, please contact the
              General Services Office.
            </p>
          </footer>
        </section>
      </div>
    </main>
  );
}
