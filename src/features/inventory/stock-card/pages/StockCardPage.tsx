import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil } from "lucide-react";

import { Button, Card } from "@/components/ui";

import StockCardDialog from "../components/StockCardDialog";
import StockCardList from "../components/StockCardList";
import StockCardTable from "../components/StockCardTable";
import StockCardToolbar from "../components/StockCardToolbar";
import StockCardTransactionDialog from "../components/StockCardTransactionDialog";

import { useStockCards } from "../hooks/useStockCards";
import { useStockCardTransactions } from "../hooks/useStockCardTransactions";

import { buildStockCardRows } from "../utils/buildStockCardRows";

import type { StockCard, StockCardTransaction } from "../types";

export default function StockCardPage() {
  const stockCards = useStockCards();

  const [search, setSearch] = useState("");

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [officeFilter, setOfficeFilter] = useState("ALL");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingStockCard, setEditingStockCard] = useState<StockCard | null>(
    null,
  );

  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState<StockCardTransaction | null>(null);

  const transactions = useStockCardTransactions(selectedId);

  const filteredStockCards = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return stockCards.data ?? [];
    }

    return (stockCards.data ?? []).filter(
      (stockCard) =>
        stockCard.item.toLowerCase().includes(query) ||
        stockCard.stock_no.toLowerCase().includes(query) ||
        stockCard.description?.toLowerCase().includes(query),
    );
  }, [stockCards.data, search]);

  const selectedStockCard = useMemo(
    () =>
      stockCards.data?.find((stockCard) => stockCard.id === selectedId) ?? null,
    [stockCards.data, selectedId],
  );

  const transactionRows = useMemo(
    () => buildStockCardRows(transactions.data ?? []),
    [transactions.data],
  );

  const currentBalance =
    transactionRows.length > 0
      ? transactionRows[transactionRows.length - 1].balance
      : 0;

  const offices = useMemo(() => {
    const uniqueOffices = new Set<string>();

    transactionRows.forEach((transaction) => {
      if (transaction.transaction_type === "ISSUE" && transaction.office) {
        uniqueOffices.add(transaction.office);
      }
    });

    return Array.from(uniqueOffices).sort((a, b) => a.localeCompare(b));
  }, [transactionRows]);

  const filteredTransactionRows = useMemo(() => {
    if (officeFilter === "ALL") {
      return transactionRows;
    }

    return transactionRows.filter(
      (transaction) =>
        transaction.transaction_type === "RECEIPT" ||
        transaction.office === officeFilter,
    );
  }, [transactionRows, officeFilter]);

  function handleCreate() {
    setEditingStockCard(null);
    setDialogOpen(true);
  }

  function handleEdit() {
    if (!selectedStockCard) return;

    setEditingStockCard(selectedStockCard);

    setDialogOpen(true);
  }

  function handleCloseDialog() {
    setDialogOpen(false);
    setEditingStockCard(null);
  }

  function handleSelectStockCard(stockCard: StockCard) {
    setSelectedId(stockCard.id);

    setOfficeFilter("ALL");

    setEditingTransaction(null);
    setTransactionDialogOpen(false);
  }

  function handleAddTransaction() {
    setEditingTransaction(null);
    setTransactionDialogOpen(true);
  }

  function handleEditTransaction(transaction: StockCardTransaction) {
    setEditingTransaction(transaction);
    setTransactionDialogOpen(true);
  }

  function handleCloseTransactionDialog() {
    setTransactionDialogOpen(false);
    setEditingTransaction(null);
  }

  if (stockCards.isLoading) {
    return <div className="p-6">Loading stock cards...</div>;
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Breadcrumb */}

        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link
            to="/dashboard"
            className="transition-colors hover:text-emerald-600"
          >
            Home
          </Link>

          <span>/</span>

          <span className="font-medium text-gray-900">Stock Card</span>
        </nav>

        <hr className="border-gray-200" />

        {/* Header */}

        <header className="space-y-2">
          <h2 className="text-4xl font-bold">Stock Card</h2>
          <p className="text-gray-500">Manage stock card</p>
        </header>

        {/* Main item search / create */}

        <Card>
          <StockCardToolbar
            search={search}
            onSearchChange={setSearch}
            onCreate={handleCreate}
          />
        </Card>

        {/* Main content */}

        <div className="grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
          {/* Item List */}

          <Card padding="none">
            <div className="border-b border-gray-200 px-4 py-3">
              <h3 className="font-semibold text-gray-900">Items</h3>

              <p className="text-xs text-gray-500">
                {filteredStockCards.length} item(s)
              </p>
            </div>

            <div className="max-h-162.5 overflow-auto">
              <StockCardList
                stockCards={filteredStockCards}
                selectedId={selectedId}
                onSelect={handleSelectStockCard}
              />
            </div>
          </Card>

          {/* Stock Card */}

          <div className="min-w-0">
            {selectedStockCard ? (
              <div className="space-y-3">
                {/* Actions / Office Filter */}

                <Card>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <select
                      value={officeFilter}
                      onChange={(event) => setOfficeFilter(event.target.value)}
                      className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition-colors focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:max-w-xs"
                    >
                      <option value="ALL">All Offices</option>
                      {offices.map((office) => (
                        <option key={office} value={office}>
                          {office}
                        </option>
                      ))}
                    </select>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button
                        onClick={handleAddTransaction}
                        className="flex-1 sm:flex-initial"
                      >
                        Add Transaction
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={handleEdit}
                        className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5"
                      >
                        <Pencil className="h-4 w-4" />
                        <span>Edit Item</span>
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Transactions */}

                {transactions.isLoading ? (
                  <Card>
                    <div className="py-12 text-center text-sm text-gray-500">
                      Loading transactions...
                    </div>
                  </Card>
                ) : (
                  <StockCardTable
                    stockCard={selectedStockCard}
                    transactions={filteredTransactionRows}
                    onEditTransaction={handleEditTransaction}
                  />
                )}
              </div>
            ) : (
              <Card>
                <div className="py-16 text-center">
                  <h3 className="font-semibold text-gray-900">
                    Select an item
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Select an item to view its stock card.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Stock Card Item Dialog */}

      <StockCardDialog
        open={dialogOpen}
        stockCard={editingStockCard}
        onClose={handleCloseDialog}
      />

      {/* Transaction Dialog */}

      {selectedStockCard && (
        <StockCardTransactionDialog
          open={transactionDialogOpen}
          stockCardId={selectedStockCard.id}
          transaction={editingTransaction}
          currentBalance={currentBalance}
          onClose={handleCloseTransactionDialog}
        />
      )}
    </>
  );
}
