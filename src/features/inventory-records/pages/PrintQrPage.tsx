import { useParams } from "react-router-dom";
import { usePublicInventoryRecord } from "@/features/public";
import PrintableQrCard from "../components/PrintableQrCard";

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
    <main className="min-h-screen bg-gray-100 print:bg-white">
      <div className="sticky top-0 z-10 flex justify-center bg-white p-4 shadow print:hidden">
        <button
          onClick={() => window.print()}
          className="rounded bg-blue-600 px-6 py-2 text-white"
        >
          Print QR
        </button>
      </div>

      <div className="flex justify-center items-start p-8 print:block print:p-0 print:m-0">
        <PrintableQrCard record={record} />
      </div>
    </main>
  );
}
