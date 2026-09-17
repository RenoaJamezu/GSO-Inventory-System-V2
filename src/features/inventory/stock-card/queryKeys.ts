export const stockCardKeys = {
  root: ["stock-cards"] as const,

  lists: () => [...stockCardKeys.root, "list"] as const,

  list: () => stockCardKeys.lists(),

  details: () => [...stockCardKeys.root, "detail"] as const,

  detail: (id: number) => [...stockCardKeys.details(), id] as const,

  transactions: (stockCardId: number) =>
    [...stockCardKeys.root, "transactions", stockCardId] as const,
};
