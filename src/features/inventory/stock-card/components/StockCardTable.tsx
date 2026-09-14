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
  const headerCell =
    "border border-slate-200 px-4 py-2.5 dark:border-slate-700";

  const tableHeaderCell = [
    "border border-slate-200",
    "px-4 py-2.5",
    "text-xs font-semibold",
    "uppercase tracking-wide",
    "text-slate-600",
    "dark:border-slate-700",
    "dark:text-slate-300",
  ].join(" ");

  const bodyCell = [
    "border border-slate-200",
    "px-4 py-3",
    "text-sm",
    "text-slate-700",
    "dark:border-slate-800",
    "dark:text-slate-300",
  ].join(" ");

  return (
    <div
      className="
        overflow-hidden
        rounded-lg border
        border-slate-200
        bg-white

        dark:border-slate-800
        dark:bg-slate-900
      "
    >
      <div className="max-h-[40rem] overflow-auto">
        <table className="min-w-[900px] w-full border-collapse text-left">
          <thead>
            {/* Stock card information */}
            <tr className="bg-slate-50 dark:bg-slate-800/60">
              <th className={headerCell} colSpan={5}>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Item:
                </span>

                <span className="ml-2 text-sm font-medium normal-case text-slate-900 dark:text-slate-100">
                  {stockCard.item}
                </span>
              </th>

              <th className={headerCell} colSpan={2}>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Stock No.:
                </span>

                <span className="ml-2 text-sm font-medium normal-case text-slate-900 dark:text-slate-100">
                  {stockCard.stock_no}
                </span>
              </th>
            </tr>

            <tr className="bg-slate-50 dark:bg-slate-800/60">
              <th className={headerCell} colSpan={7}>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Description:
                </span>

                <span className="ml-2 text-sm font-normal normal-case text-slate-800 dark:text-slate-200">
                  {stockCard.description || "—"}
                </span>
              </th>
            </tr>

            <tr className="bg-slate-50 dark:bg-slate-800/60">
              <th className={headerCell} colSpan={5}>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Unit of Measurement:
                </span>

                <span className="ml-2 text-sm font-medium normal-case text-slate-900 dark:text-slate-100">
                  {stockCard.unit_of_measurement}
                </span>
              </th>

              <th className={headerCell} colSpan={2}>
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Re-order Point:
                </span>

                <span className="ml-2 text-sm font-medium normal-case text-slate-900 dark:text-slate-100">
                  {stockCard.reorder_point ?? "—"}
                </span>
              </th>
            </tr>

            {/* Main table header */}
            <tr className="bg-slate-100 dark:bg-slate-800">
              <th
                rowSpan={2}
                className={`${tableHeaderCell} whitespace-nowrap`}
              >
                Date
              </th>

              <th rowSpan={2} className={tableHeaderCell}>
                Reference
              </th>

              <th className={`${tableHeaderCell} text-center`}>Receipt</th>

              <th colSpan={2} className={`${tableHeaderCell} text-center`}>
                Issue
              </th>

              <th className={`${tableHeaderCell} text-center`}>Balance</th>

              <th rowSpan={2} className={`${tableHeaderCell} text-center`}>
                No. of Days to Consume
              </th>
            </tr>

            <tr className="bg-slate-100 dark:bg-slate-800">
              <th className={`${tableHeaderCell} text-center`}>Qty</th>

              <th className={`${tableHeaderCell} text-center`}>Qty</th>

              <th className={tableHeaderCell}>Office</th>

              <th className={`${tableHeaderCell} text-center`}>Qty</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="
                    border border-slate-200
                    px-6 py-14
                    text-center
                    text-sm
                    text-slate-500

                    dark:border-slate-800
                    dark:text-slate-400
                  "
                >
                  No transactions yet.
                </td>
              </tr>
            ) : (
              transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  onClick={() => onEditTransaction(transaction)}
                  className="
                      cursor-pointer
                      bg-white
                      transition-colors
                      hover:bg-slate-50

                      dark:bg-slate-900
                      dark:hover:bg-slate-800/50
                    "
                >
                  <td className={`${bodyCell} whitespace-nowrap`}>
                    {transaction.transaction_date}
                  </td>

                  <td className={bodyCell}>{transaction.reference || "—"}</td>

                  <td className={`${bodyCell} text-center tabular-nums`}>
                    {transaction.receipt_quantity ?? ""}
                  </td>

                  <td className={`${bodyCell} text-center tabular-nums`}>
                    {transaction.issue_quantity ?? ""}
                  </td>

                  <td className={bodyCell}>{transaction.office || ""}</td>

                  <td
                    className={`${bodyCell} text-center font-semibold tabular-nums text-slate-900 dark:text-slate-100`}
                  >
                    {transaction.balance}
                  </td>

                  <td className={`${bodyCell} text-center tabular-nums`}>
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
