import { useParams } from "react-router-dom";
import { usePublicInventoryRecord } from "../hooks/usePublicRecord";
import { renderPublicValue } from "../utils/renderPublicView";
import { Card } from "@/components/ui";
import QRCode from "react-qr-code";

function getInventoryType(inventory_type: string) {
  if (inventory_type === "PAR") {
    return {
      bg: "bg-green-50",
      border: "border-green-500",
      badge: "bg-green-600 text-white",
      text: "text-green-600",
      type: "PAR",
    };
  }

  if (inventory_type === "HIGH_COST") {
    return {
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      badge: "bg-yellow-500 text-white",
      text: "text-yellow-600",
      type: "High Cost",
    };
  }

  return {
    bg: "bg-purple-50",
    border: "border-purple-400",
    badge: "bg-purple-500 text-white",
    text: "text-purple-600",
    type: "Low Cost",
  };
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
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Record not found.
      </div>
    );
  }

  const asset = getInventoryType(record.inventory_type);

  const qrUrl = `${window.location.origin}/public/${record.qr_uuid}`;

  return (
    <main className="min-h-screen bg-gray-100 p-6 ">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <img
            src="/images/sibagat-logo.png"
            className="h-16 p-2 border border-gray-300 rounded-lg bg-white shadow-md"
          />
          <div>
            <h4 className="text-xl font-bold">GSO Inventory</h4>
            <p className="text-gray-500">Local Government Unit</p>
          </div>
        </div>

        <Card>
          {/* Header */}
          <div className="flex items-center gap-4">
            <QRCode
              value={qrUrl}
              size={128}
              className="border border-gray-200 p-3 rounded-lg bg-gray-50"
            />

            <div>
              <div
                className={`flex items-center gap-1 rounded-full border px-2 py-0.5 ${asset.border} ${asset.bg} inline-flex`}
              >
                <span className={`rounded-full text-xs p-1 ${asset.badge}`} />
                <span className={`text-[11px] font-bold ${asset.text}`}>
                  {asset.type}
                </span>
              </div>

              <div>
                <h1 className="text-2xl font-bold capitalize">
                  {record.account_title}
                </h1>

                <p className="text-sm text-gray-500">
                  Public Asset Information
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="border-x border-gray-200 mt-6">
            {record.columns.map((column) => (
              <div
                key={column.field_key}
                className="flex flex-col gap-1 p-5 border-y border-gray-200"
              >
                <div className="font-medium text-gray-600 uppercase text-[11px]">
                  {column.label}
                </div>

                <div className="text-gray-900 border border-gray-200 p-2 rounded-lg bg-gray-100 mt-1 font-medium">
                  {renderPublicValue(
                    record.data[column.field_key],
                    column.data_type,
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <span className="text-xs text-gray-500 pt-2">
            This is a read-only public view. For corrections, contact the
            General Services Office.
          </span>
        </Card>
      </div>
    </main>
  );
}
