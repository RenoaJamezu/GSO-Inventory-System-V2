import { z } from "zod";

export const groupSchema = z.object({
  group_name: z
    .string()
    .trim()
    .min(1, "Group name is required.")
    .max(200, "Group name must not exceed 200 characters."),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters.")
    .optional()
    .or(z.literal("")),
});

export type GroupFormValues = z.infer<typeof groupSchema>;
