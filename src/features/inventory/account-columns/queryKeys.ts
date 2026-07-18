export const accountColumnKeys = {
  all: (accountId: number) => ["account_columns", accountId] as const,

  detail: (id: number) => ["account_columns", id] as const,
};
