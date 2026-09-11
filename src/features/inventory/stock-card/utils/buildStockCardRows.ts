import type { StockCardTransaction, StockCardTransactionRow } from "../types";

export function buildStockCardRows(
  transactions: StockCardTransaction[],
): StockCardTransactionRow[] {
  let balance = 0;

  return transactions.map((transaction) => {
    if (transaction.transaction_type === "RECEIPT") {
      balance += transaction.quantity;
    }

    if (transaction.transaction_type === "ISSUE") {
      balance -= transaction.quantity;
    }

    return {
      ...transaction,

      receipt_quantity:
        transaction.transaction_type === "RECEIPT"
          ? transaction.quantity
          : null,

      issue_quantity:
        transaction.transaction_type === "ISSUE" ? transaction.quantity : null,

      balance,
    };
  });
}
