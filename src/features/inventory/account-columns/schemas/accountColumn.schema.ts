import { z } from "zod";

export const accountColumnSchema = z
  .object({
    label: z.string().trim().min(1, "Column label is required."),
    data_type: z.enum(["text", "textarea", "number", "date", "boolean"]),
    placeholder: z.string(),
    description: z.string(),
    is_required: z.boolean(),
    is_amount_column: z.boolean(),
  })
  .refine(
    (values) => !values.is_amount_column || values.data_type === "number",
    {
      message: "Amount columns must use the Number data type.",
      path: ["data_type"],
    },
  );

export type AccountColumnForm = z.infer<typeof accountColumnSchema>;
