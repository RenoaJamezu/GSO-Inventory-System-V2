import { z } from "zod";

export const stockCardTransactionSchema = z
  .object({
    transaction_date: z.string().min(1, "Date is required."),

    reference: z.string(),

    transaction_type: z.enum(["RECEIPT", "ISSUE"]),

    quantity: z
      .string()
      .trim()
      .min(1, "Quantity is required.")
      .refine(
        (value) => !Number.isNaN(Number(value)) && Number(value) > 0,
        "Quantity must be greater than 0.",
      ),

    office: z.string(),

    days_to_consume: z
      .string()
      .refine(
        (value) =>
          value.trim() === "" ||
          (!Number.isNaN(Number(value)) && Number(value) >= 0),
        "Days to consume must be 0 or greater.",
      ),
  })
  .superRefine((values, ctx) => {
    if (values.transaction_type === "ISSUE" && values.office.trim() === "") {
      ctx.addIssue({
        code: "custom",
        path: ["office"],
        message: "Office is required for an issue.",
      });
    }
  });

export type StockCardTransactionFormValues = z.infer<
  typeof stockCardTransactionSchema
>;
