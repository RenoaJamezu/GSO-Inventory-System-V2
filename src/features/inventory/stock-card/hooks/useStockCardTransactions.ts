import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStockCardTransaction,
  deleteStockCardTransaction,
  getStockCardTransactions,
  updateStockCardTransaction,
} from "../api/stockCardTransactions.api";

import { stockCardKeys } from "../queryKeys";

export function useStockCardTransactions(stockCardId: number | null) {
  return useQuery({
    queryKey: stockCardKeys.transactions(stockCardId ?? 0),

    queryFn: () => getStockCardTransactions(stockCardId as number),

    enabled:
      stockCardId !== null && Number.isFinite(stockCardId) && stockCardId > 0,
  });
}

export function useCreateStockCardTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStockCardTransaction,

    onSuccess: (transaction) => {
      queryClient.invalidateQueries({
        queryKey: stockCardKeys.transactions(transaction.stock_card_id),
      });
    },
  });
}

export function useUpdateStockCardTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStockCardTransaction,

    onSuccess: (transaction) => {
      queryClient.invalidateQueries({
        queryKey: stockCardKeys.transactions(transaction.stock_card_id),
      });
    },
  });
}

export function useDeleteStockCardTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      stockCardId,
    }: {
      id: number;
      stockCardId: number;
    }) => {
      await deleteStockCardTransaction(id);

      return stockCardId;
    },

    onSuccess: (stockCardId) => {
      queryClient.invalidateQueries({
        queryKey: stockCardKeys.transactions(stockCardId),
      });
    },
  });
}
