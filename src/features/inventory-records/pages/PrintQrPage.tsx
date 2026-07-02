import { useParams } from "react-router-dom";

import PrintableQrCard from "../components/PrintableQrCard";
import { usePublicInventoryRecord } from "@/features/public/hooks/usePublicRecord";

export default function PrintQrPage() {
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

  return (
    <main className="min-h-screen bg-gray-100 py-10">
      <div className="mb-6 flex justify-center">
        <button
          onClick={() => window.print()}
          className="rounded bg-blue-600 px-6 py-2 text-white print:hidden"
        >
          Print QR
        </button>
      </div>

      <PrintableQrCard record={record} />
    </main>
  );
}
