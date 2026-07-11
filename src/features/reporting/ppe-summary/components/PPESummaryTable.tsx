import { formatCurrency } from "@/lib/utils/format";
import type { PPESummaryRow } from "../types";

type Props = {
  rows: PPESummaryRow[];

  totals: {
    bookValue: number;
    perInventoryReport: number;
    variance: number;
  };
};

export default function PPESummaryTable({ rows, totals }: Props) {
  const formatCellValue = (value: number | null | undefined): string => {
    if (value === 0 || value === null || value === undefined) return "";
    return value.toLocaleString();
  };

  return (
    <table className="w-full table-fixed border-collapse">
      <thead className="text-[13px]">
        <tr className="font-bold">
          <th className="w-10 border border-black py-1 text-center">NO.</th>

          <th className="border border-black py-1 text-center">
            ACCOUNT TITLE
          </th>

          <th className="w-20 border border-black py-1 text-center">
            BOOK VALUE
          </th>

          <th className="w-44 border border-black py-1 text-center">
            PER INVENTORY REPORT
          </th>

          <th className="w-20 border border-black py-1 text-center">
            VARIANCE
          </th>
        </tr>
      </thead>

      <tbody className="text-[12px]">
        {rows.map((row, index) => (
          <tr key={row.id}>
            <td className="border border-black px-2 text-center">
              {index + 1}
            </td>

            <td className="border border-black px-2 uppercase">
              {row.account_title}
            </td>

            <td className="border border-black px-2 text-right">
              {formatCellValue(row.book_value)}
            </td>

            <td className="border border-black px-2 text-right">
              {formatCurrency(row.per_inventory_report)}
            </td>

            <td className="border border-black px-2 text-right">
              {formatCellValue(row.variance)}
            </td>
          </tr>
        ))}

        <tr className="font-bold">
          <td colSpan={2} className="border border-black px-2 text-center">
            TOTAL
          </td>

          <td className="border border-black px-2 text-right">
            {formatCellValue(totals.bookValue)}
          </td>

          <td className="border border-black px-2 text-right">
            {formatCellValue(totals.perInventoryReport)}
          </td>

          <td className="border border-black px-2 text-right">
            {formatCellValue(totals.variance)}
          </td>
        </tr>
      </tbody>
    </table>
  );
}
