export const stockCardKeys = {
  all: ["stock-cards"] as const,

  list: () => [...stockCardKeys.all, "list"] as const,

  detail: (id: number) => [...stockCardKeys.all, "detail", id] as const,

  transactions: (stockCardId: number) =>
    [...stockCardKeys.all, "transactions", stockCardId] as const,
};
