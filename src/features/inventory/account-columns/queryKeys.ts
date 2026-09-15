export const accountColumnKeys = {
  root: ["account-columns"] as const,

  lists: () => [...accountColumnKeys.root, "list"] as const,

  list: (accountId: number) =>
    [...accountColumnKeys.lists(), accountId] as const,
};
