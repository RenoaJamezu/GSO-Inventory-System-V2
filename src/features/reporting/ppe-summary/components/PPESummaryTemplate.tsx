import type { PPESummaryData } from "../types";

import PPESummaryHeader from "./PPESummaryHeader";
import PPESummaryTable from "./PPESummaryTable";
import PPESummaryFooter from "./PPESummaryFooter";

type Props = {
  data: PPESummaryData;
};

export default function PPESummaryTemplate({ data }: Props) {
  return (
    <div
      className="
        mx-auto
        bg-white
        text-black
        font-times
        print:shadow-none
      "
      style={{
        width: "8.5in",
        minHeight: "12in",
        padding: "0.5in",
        boxSizing: "border-box",
      }}
    >
      <PPESummaryHeader
        reportTitle={data.reportTitle}
        propertyType={data.propertyType}
        asOf={data.asOf}
      />

      <PPESummaryTable rows={data.rows} totals={data.totals} />

      <PPESummaryFooter />
    </div>
  );
}
