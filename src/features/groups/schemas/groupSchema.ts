import { z } from "zod";

export const groupSchema = z.object({
  account_id: z.number(),

  group_name: z
    .string()
    .trim()
    .min(1, "Group name is required.")
    .max(100, "Group name must not exceed 100 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters.")
    .optional()
    .or(z.literal("")),

  sort_order: z.number().int().min(0),
});

export type GroupFormValues = z.infer<typeof groupSchema>;
