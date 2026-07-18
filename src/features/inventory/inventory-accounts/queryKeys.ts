export const inventoryAccountKeys = {
  all: ["inventory-accounts"] as const,

  detail: (id: number) => ["inventory-accounts", id] as const,
};
