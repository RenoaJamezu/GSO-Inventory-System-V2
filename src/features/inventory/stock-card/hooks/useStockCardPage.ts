import { useMemo, useState } from "react";

import { PERMISSIONS, usePermissions } from "@/features/auth";

import { useStockCards } from "./useStockCards";
import { useStockCardTransactions } from "./useStockCardTransactions";
import { buildStockCardRows } from "../utils/buildStockCardRows";
import type { StockCard, StockCardTransaction } from "../types";

const ALL_OFFICES = "ALL";

export function useStockCardPage() {
  const stockCardsQuery = useStockCards();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [officeFilter, setOfficeFilter] = useState(ALL_OFFICES);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingStockCard, setEditingStockCard] = useState<StockCard | null>(
    null,
  );

  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);

  const [editingTransaction, setEditingTransaction] =
    useState<StockCardTransaction | null>(null);

  const transactionsQuery = useStockCardTransactions(selectedId);

  const { can } = usePermissions();

  const canCreate = can(PERMISSIONS.STOCK_CARD_CREATE);

  const canUpdate = can(PERMISSIONS.STOCK_CARD_UPDATE);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stockCards = stockCardsQuery.data ?? [];

  const filteredStockCards = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return stockCards;
    }

    return stockCards.filter((stockCard) => {
      return (
        stockCard.item.toLowerCase().includes(normalizedSearch) ||
        stockCard.stock_no.toLowerCase().includes(normalizedSearch) ||
        stockCard.description?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [search, stockCards]);

  const selectedStockCard = useMemo(() => {
    if (selectedId === null) {
      return null;
    }

    return stockCards.find((stockCard) => stockCard.id === selectedId) ?? null;
  }, [selectedId, stockCards]);

  const transactionRows = useMemo(
    () => buildStockCardRows(transactionsQuery.data ?? []),
    [transactionsQuery.data],
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

    return Array.from(uniqueOffices).sort((firstOffice, secondOffice) =>
      firstOffice.localeCompare(secondOffice),
    );
  }, [transactionRows]);

  const filteredTransactionRows = useMemo(() => {
    if (officeFilter === ALL_OFFICES) {
      return transactionRows;
    }

    return transactionRows.filter(
      (transaction) =>
        transaction.transaction_type === "RECEIPT" ||
        transaction.office === officeFilter,
    );
  }, [officeFilter, transactionRows]);

  function createStockCard() {
    if (!canCreate) {
      return;
    }

    setEditingStockCard(null);
    setDialogOpen(true);
  }

  function editSelectedStockCard() {
    if (!canUpdate || !selectedStockCard) {
      return;
    }

    setEditingStockCard(selectedStockCard);
    setDialogOpen(true);
  }

  function closeStockCardDialog() {
    setDialogOpen(false);
    setEditingStockCard(null);
  }

  function selectStockCard(stockCard: StockCard) {
    setSelectedId(stockCard.id);
    setOfficeFilter(ALL_OFFICES);

    setEditingTransaction(null);
    setTransactionDialogOpen(false);
  }

  function addTransaction() {
    if (!canCreate || !selectedStockCard) {
      return;
    }

    setEditingTransaction(null);
    setTransactionDialogOpen(true);
  }

  function editTransaction(transaction: StockCardTransaction) {
    if (!canUpdate) {
      return;
    }

    setEditingTransaction(transaction);
    setTransactionDialogOpen(true);
  }

  function closeTransactionDialog() {
    setTransactionDialogOpen(false);
    setEditingTransaction(null);
  }

  return {
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
  };
}
