import { z } from "zod";

export const vehicleRecordSchema = z.object({
  model: z.string().trim().min(1, "Model is required."),

  engine_no: z.string(),
  chassis_no: z.string(),

  plate_no: z.string().trim().min(1, "Plate number is required."),

  office: z.string(),
  memorandum_receipt: z.string(),

  driver: z.string(),
  cellphone_no: z.string(),

  expiration_date: z.string(),

  property_no: z.string(),
  date_acquired: z.string(),

  cost: z.number().min(0, "Cost must be 0 or greater.").nullable(),
});

export type VehicleRecordFormValues = z.infer<typeof vehicleRecordSchema>;
