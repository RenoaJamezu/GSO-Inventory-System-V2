import { z } from "zod";

export const accountColumnSchema = z.object({
  label: z.string().trim().min(1, "Label is required."),
  data_type: z.enum(["text", "number", "date", "boolean"]),
  placeholder: z.string(),
  description: z.string(),
  is_required: z.boolean(),
  is_amount_column: z.boolean(),
});

export type AccountColumnForm = z.infer<typeof accountColumnSchema>;
