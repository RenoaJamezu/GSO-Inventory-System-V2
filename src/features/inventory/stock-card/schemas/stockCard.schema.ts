import { z } from "zod";

export const stockCardSchema = z.object({
  item: z.string().trim().min(1, "Item is required."),

  stock_no: z.string().trim().min(1, "Stock number is required."),

  description: z.string(),

  unit_of_measurement: z
    .string()
    .trim()
    .min(1, "Unit of measurement is required."),

  reorder_point: z
    .string()
    .refine(
      (value) =>
        value.trim() === "" ||
        (!Number.isNaN(Number(value)) && Number(value) >= 0),
      "Re-order point must be 0 or greater.",
    ),
});

export type StockCardFormValues = z.infer<typeof stockCardSchema>;
