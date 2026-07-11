import { useInventoryAccounts } from "@/features/inventory-accounts";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import PPESummaryTemplate from "../components/PPESummaryTemplate";
import { buildPPESummary } from "../utils/buildPPESummary";
import { useReactToPrint } from "react-to-print";

export default function PPESummaryPage() {
  const { data: accounts = [], isLoading } = useInventoryAccounts();

  const [searchParams] = useSearchParams();

  const selectedDate =
    searchParams.get("date") ?? new Date().toISOString().split("T")[0];

  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: `PPE Summary ${new Date().getFullYear()}`,
  });

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  const report = buildPPESummary({
    accounts,
    propertyType: "PROPERTY, PLANT AND EQUIPMENT",
    asOf: new Date(selectedDate),
  });

  return (
    <div>
      <div className="mb-6 flex justify-center">
        <button
          onClick={handlePrint}
          className="rounded bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
        >
          Print Report
        </button>
      </div>
      <div ref={reportRef}>
        <PPESummaryTemplate data={report} />
      </div>
    </div>
  );
}
