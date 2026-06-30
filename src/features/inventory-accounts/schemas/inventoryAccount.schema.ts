import { z } from "zod";

export const inventoryAccountSchema = z.object({
  account_title: z.string().trim().min(1, "Account title is required."),
  book_value: z.number().min(0, "Book value cannot be negative."),
  variance: z.number(),
});

export type InventoryAccountForm = z.infer<typeof inventoryAccountSchema>;
