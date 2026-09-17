import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createStockCard,
  deleteStockCard,
  getStockCard,
  getStockCards,
  updateStockCard,
} from "../api/stockCards.api";
import { stockCardKeys } from "../queryKeys";

export function useStockCards() {
  return useQuery({
    queryKey: stockCardKeys.list(),
    queryFn: getStockCards,
  });
}

export function useStockCard(id: number) {
  return useQuery({
    queryKey: stockCardKeys.detail(id),
    queryFn: () => getStockCard(id),
    enabled: Number.isFinite(id) && id > 0,
  });
}

export function useCreateStockCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createStockCard,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: stockCardKeys.lists(),
      });
    },
  });
}

export function useUpdateStockCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateStockCard,

    onSuccess: (stockCard) => {
      queryClient.invalidateQueries({
        queryKey: stockCardKeys.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: stockCardKeys.detail(stockCard.id),
      });
    },
  });
}

export function useDeleteStockCard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteStockCard,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: stockCardKeys.lists(),
      });
    },
  });
}
