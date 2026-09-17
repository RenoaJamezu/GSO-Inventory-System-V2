import { Link } from "react-router-dom";

import { ChevronRight, Pencil, Plus } from "lucide-react";

import { FormSelect } from "@/components/form";
import { Button, Card, PageHeader } from "@/components/ui";

import StockCardDialog from "../components/StockCardDialog";
import StockCardList from "../components/StockCardList";
import StockCardTable from "../components/StockCardTable";
import StockCardToolbar from "../components/StockCardToolbar";
import StockCardTransactionDialog from "../components/StockCardTransactionDialog";
import { useStockCardPage } from "../hooks/useStockCardPage";

export default function StockCardPage() {
  const {
    stockCardsQuery,
    transactionsQuery,

    filteredStockCards,
    selectedStockCard,
    filteredTransactionRows,
    offices,
    currentBalance,

    search,
    setSearch,

    selectedId,

    officeFilter,
    setOfficeFilter,

    dialogOpen,
    editingStockCard,

    transactionDialogOpen,
    editingTransaction,

    canCreate,
    canUpdate,

    createStockCard,
    editSelectedStockCard,
    closeStockCardDialog,

    selectStockCard,

    addTransaction,
    editTransaction,
    closeTransactionDialog,
  } = useStockCardPage();

  if (stockCardsQuery.isLoading) {
    return (
      <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
        Loading stock cards...
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
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

        <Card>
          <StockCardToolbar
            search={search}
            onSearchChange={setSearch}
            onCreate={createStockCard}
          />
        </Card>

        <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <Card>
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

            <div className="max-h-160 overflow-y-auto">
              <StockCardList
                stockCards={filteredStockCards}
                selectedId={selectedId}
                onSelect={selectStockCard}
              />
            </div>
          </Card>

          <div className="min-w-0">
            {selectedStockCard ? (
              <div className="space-y-4">
                <Card>
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
                        options={[
                          {
                            value: "",
                            label: "All Offices",
                          },
                          ...offices.map((office) => ({
                            value: office,
                            label: office,
                          })),
                        ]}
                        onChange={setOfficeFilter}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {canCreate && (
                        <Button
                          onClick={addTransaction}
                          className="flex items-center gap-2"
                        >
                          <Plus size={16} />
                          Add Transaction
                        </Button>
                      )}

                      {canUpdate && (
                        <Button
                          variant="secondary"
                          onClick={editSelectedStockCard}
                          className="flex items-center gap-2"
                        >
                          <Pencil size={16} />
                          Edit Item
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>

                {transactionsQuery.isLoading ? (
                  <Card>
                    <div className="py-12 text-center text-sm text-slate-500 dark:text-slate-400">
                      Loading transactions...
                    </div>
                  </Card>
                ) : (
                  <StockCardTable
                    stockCard={selectedStockCard}
                    transactions={filteredTransactionRows}
                    onEditTransaction={editTransaction}
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
        onClose={closeStockCardDialog}
      />

      {selectedStockCard && (
        <StockCardTransactionDialog
          open={transactionDialogOpen}
          stockCardId={selectedStockCard.id}
          transaction={editingTransaction}
          currentBalance={currentBalance}
          onClose={closeTransactionDialog}
        />
      )}
    </>
  );
}
