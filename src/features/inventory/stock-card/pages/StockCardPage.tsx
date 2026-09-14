import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { ChevronRight, Pencil, Plus } from "lucide-react";

import { Button, Card, PageHeader } from "@/components/ui";

import { FormSelect } from "@/components/form";

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
    return (
      <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading stock cards...
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-sm"
        >
          <Link
            to="/dashboard"
            className="
              text-slate-500
              transition-colors
              hover:text-emerald-700
              dark:text-slate-400
              dark:hover:text-emerald-400
            "
          >
            Dashboard
          </Link>

          <ChevronRight
            size={15}
            className="text-slate-400 dark:text-slate-600"
          />

          <span className="font-medium text-slate-700 dark:text-slate-200">
            Stock Card
          </span>
        </nav>

        <PageHeader
          title="Stock Card"
          description="Manage stock items, receipts, issuances, balances, and consumption records."
        />

        {/* Search / create */}
        <Card padding="none">
          <StockCardToolbar
            search={search}
            onSearchChange={setSearch}
            onCreate={handleCreate}
          />
        </Card>

        {/* Workspace */}
        <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          {/* Item list */}
          <Card padding="none">
            <div
              className="
                border-b
                border-slate-200
                px-4 py-3
                dark:border-slate-800
              "
            >
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Stock Items
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                {filteredStockCards.length} item
                {filteredStockCards.length !== 1 ? "s" : ""}
              </p>
            </div>

            <div className="max-h-[40rem] overflow-y-auto">
              <StockCardList
                stockCards={filteredStockCards}
                selectedId={selectedId}
                onSelect={handleSelectStockCard}
              />
            </div>
          </Card>

          {/* Selected stock card */}
          <div className="min-w-0">
            {selectedStockCard ? (
              <div className="space-y-4">
                {/* Actions / filter */}
                <Card padding="none">
                  <div
                    className="
                      flex flex-col gap-3
                      p-4

                      md:flex-row
                      md:items-center
                      md:justify-between
                    "
                  >
                    <div className="w-full md:max-w-xs">
                      <FormSelect
                        value={officeFilter}
                        onChange={(event) =>
                          setOfficeFilter(event.target.value)
                        }
                      >
                        <option value="ALL">All Offices</option>

                        {offices.map((office) => (
                          <option key={office} value={office}>
                            {office}
                          </option>
                        ))}
                      </FormSelect>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        onClick={handleAddTransaction}
                        className="flex items-center gap-2"
                      >
                        <Plus size={16} />
                        Add Transaction
                      </Button>

                      <Button
                        variant="secondary"
                        onClick={handleEdit}
                        className="flex items-center gap-2"
                      >
                        <Pencil size={16} />
                        Edit Item
                      </Button>
                    </div>
                  </div>
                </Card>

                {/* Transactions */}
                {transactions.isLoading ? (
                  <Card>
                    <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
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
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Select a stock item
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Select an item from the list to view its stock card and
                    transaction history.
                  </p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <StockCardDialog
        open={dialogOpen}
        stockCard={editingStockCard}
        onClose={handleCloseDialog}
      />

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
