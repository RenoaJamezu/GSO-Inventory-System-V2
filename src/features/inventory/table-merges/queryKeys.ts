export const accountColumnGroupKeys = {
  root: ["account-column-groups"] as const,

  lists: () => [...accountColumnGroupKeys.root, "list"] as const,

  list: (accountId: number) =>
    [...accountColumnGroupKeys.lists(), accountId] as const,
};
