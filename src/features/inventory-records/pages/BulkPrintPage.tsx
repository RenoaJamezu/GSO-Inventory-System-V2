import { useSearchParams } from "react-router-dom";

import PrintableQrCard from "../components/PrintableQrCard";
import { usePublicInventoryRecords } from "@/features/public/hooks/usePublicRecord";

export default function BulkPrintPage() {
  const [searchParams] = useSearchParams();

  const ids =
    searchParams
      .get("ids")
      ?.split(",")
      .map(Number)
      .filter((id) => !Number.isNaN(id)) ?? [];

  const { data: records = [], isLoading } = usePublicInventoryRecords(ids);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 print:bg-white">
      <div className="sticky top-0 z-10 flex justify-center bg-white p-4 shadow print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded bg-blue-600 px-6 py-2 text-white"
        >
          Print {records.length} QR Code{records.length !== 1 ? "s" : ""}
        </button>
      </div>

      <div className="mx-auto flex flex-wrap flex-col-2 justify-center gap-2 p-8 print:gap-2 print:p-0">
        {records.map((record) => (
          <PrintableQrCard key={record.id} record={record} />
        ))}
      </div>
    </main>
  );
}
