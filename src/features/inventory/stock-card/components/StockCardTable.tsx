import type { StockCard, StockCardTransactionRow } from "../types";

type Props = {
  stockCard: StockCard;
  transactions: StockCardTransactionRow[];
  onEditTransaction: (transaction: StockCardTransactionRow) => void;
};

export default function StockCardTable({
  stockCard,
  transactions,
  onEditTransaction,
}: Props) {
  return (
    <div className="overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="max-h-162.5 overflow-auto">
        <table className="min-w-full border-collapse text-left text-sm">
          <thead className="uppercase">
            <tr className="bg-gray-100">
              <th
                className="border border-gray-200 px-4 py-2 font-semibold"
                colSpan={5}
              >
                Item:{" "}
                <span className="font-normal capitalize">
                  {stockCard.item}
                </span>
              </th>

              <th
                className="border border-gray-200 px-4 py-2 font-semibold"
                colSpan={2}
              >
                Stock No.:{" "}
                <span className="font-normal normal-case">
                  {stockCard.stock_no}
                </span>
              </th>
            </tr>

            <tr className="bg-gray-100">
              <th
                className="border border-gray-200 px-4 py-2 font-semibold"
                colSpan={7}
              >
                Description:{" "}
                <span className="font-normal normal-case">
                  {stockCard.description || "—"}
                </span>
              </th>
            </tr>

            <tr className="bg-gray-100">
              <th
                className="border border-gray-200 px-4 py-2 font-semibold"
                colSpan={5}
              >
                Unit of Measurement:{" "}
                <span className="font-normal capitalize">
                  {stockCard.unit_of_measurement}
                </span>
              </th>

              <th
                className="border border-gray-200 px-4 py-2 font-semibold"
                colSpan={2}
              >
                Re-order Point:{" "}
                <span className="font-normal normal-case">
                  {stockCard.reorder_point ?? "—"}
                </span>
              </th>
            </tr>

            <tr className="bg-gray-100">
              <th
                rowSpan={2}
                className="border border-gray-200 px-4 py-2 font-semibold"
              >
                Date
              </th>

              <th
                rowSpan={2}
                className="border border-gray-200 px-4 py-2 font-semibold"
              >
                Reference
              </th>

              <th className="border border-gray-200 px-4 py-2 text-center font-semibold">
                Receipt
              </th>

              <th
                colSpan={2}
                className="border border-gray-200 px-4 py-2 text-center font-semibold"
              >
                Issue
              </th>

              <th className="border border-gray-200 px-4 py-2 text-center font-semibold">
                Balance
              </th>

              <th
                rowSpan={2}
                className="border border-gray-200 px-4 py-2 text-center font-semibold"
              >
                No. of Days to Consume
              </th>
            </tr>

            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 text-center font-semibold">
                Qty
              </th>

              <th className="border border-gray-200 px-4 py-2 text-center font-semibold">
                Qty
              </th>

              <th className="border border-gray-200 px-4 py-2 font-semibold">
                Office
              </th>

              <th className="border border-gray-200 px-4 py-2 text-center font-semibold">
                Qty
              </th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="border border-gray-200 px-4 py-10 text-center text-gray-500"
                >
                  No transactions yet.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  onClick={() => onEditTransaction(transaction)}
                  className="cursor-pointer transition-colors hover:bg-gray-50"
                >
                  <td className="whitespace-nowrap border border-gray-200 px-4 py-2">
                    {transaction.transaction_date}
                  </td>

                  <td className="border border-gray-200 px-4 py-2">
                    {transaction.reference || "—"}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {transaction.receipt_quantity ?? ""}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {transaction.issue_quantity ?? ""}
                  </td>

                  <td className="border border-gray-200 px-4 py-2">
                    {transaction.office || ""}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 text-center font-medium">
                    {transaction.balance}
                  </td>

                  <td className="border border-gray-200 px-4 py-2 text-center">
                    {transaction.days_to_consume ?? ""}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
