import { z } from "zod";

export const vehicleRecordSchema = z.object({
  inventory_record_id: z.number().int().nonnegative(),

  model: z.string().trim().min(1, "Model is required."),

  engine_no: z.string(),
  chassis_no: z.string(),

  office: z.string(),
  memorandum_receipt: z.string(),

  driver: z.string(),
  cellphone_no: z.string(),

  expiration_date: z.string(),
  date_acquired: z.string(),
});

export type VehicleRecordFormValues = z.infer<typeof vehicleRecordSchema>;
