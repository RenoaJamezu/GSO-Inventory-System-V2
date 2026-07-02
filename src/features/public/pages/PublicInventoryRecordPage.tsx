import { useParams } from "react-router-dom";
import { usePublicInventoryRecord } from "../hooks/usePublicRecord";

function getAssetColor(amount: number) {
  if (amount >= 50000) {
    return {
      bg: "bg-green-50",
      border: "border-green-500",
      badge: "bg-green-600 text-white",
      text: "Capital Asset",
    };
  }

  if (amount >= 15000) {
    return {
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      badge: "bg-yellow-500 text-white",
      text: "Semi-Expendable",
    };
  }

  return {
    bg: "bg-gray-50",
    border: "border-gray-400",
    badge: "bg-gray-500 text-white",
    text: "Regular Asset",
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

  const asset = getAssetColor(Number(record.amount ?? 0));

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div
        className={`mx-auto max-w-2xl rounded-2xl border-2 bg-white shadow-lg ${asset.border}`}
      >
        {/* Header */}
        <div className="border-b p-6 ${asset.bg}">
          <h1 className="text-2xl font-bold">{record.account_title}</h1>

          <p className="mt-1 text-sm text-gray-500">Public Asset Information</p>

          <div className="mt-4">
            <span className="font-semibold">Group:</span>{" "}
            {record.group_name ?? "No Group"}
          </div>
        </div>

        {/* Asset Information */}
        <div className="divide-y">
          {record.columns.map((column) => (
            <div
              key={column.field_key}
              className="flex flex-col gap-1 p-4 sm:flex-row sm:items-start sm:justify-between"
            >
              <div className="font-medium text-gray-600">{column.label}</div>

              <div className="text-gray-900 sm:text-right">
                {renderValue(record.data[column.field_key], column.data_type)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function renderValue(value: unknown, type: string) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  switch (type) {
    case "boolean":
      return value ? "Yes" : "No";

    case "number":
      return Number(value).toLocaleString();

    case "date": {
      const date = new Date(String(value));

      if (Number.isNaN(date.getTime())) {
        return String(value);
      }

      return date.toLocaleDateString();
    }

    default:
      return String(value);
  }
}
