export const inventoryAccountKeys = {
  all: ["inventory_accounts"] as const,

  detail: (id: number) => ["inventory_accounts", id] as const,
};
