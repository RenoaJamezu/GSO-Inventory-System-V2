import { supabase } from "@/lib/supabase";

import type { VehicleRecord, VehicleRecordInput } from "../types";

export async function getVehicleRecords(): Promise<VehicleRecord[]> {
  const { data, error } = await supabase
    .from("vehicle_records")
    .select("*")
    .is("deleted_at", null)
    .order("plate_no", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getVehicleRecord(id: number): Promise<VehicleRecord> {
  const { data, error } = await supabase
    .from("vehicle_records")
    .select("*")
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function createVehicleRecord(
  values: VehicleRecordInput,
): Promise<VehicleRecord> {
  const { data, error } = await supabase
    .from("vehicle_records")
    .insert(values)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

type UpdateVehicleRecordInput = {
  id: number;
  values: VehicleRecordInput;
};

export async function updateVehicleRecord({
  id,
  values,
}: UpdateVehicleRecordInput): Promise<VehicleRecord> {
  const { data, error } = await supabase
    .from("vehicle_records")
    .update({
      ...values,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .is("deleted_at", null)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function deleteVehicleRecord(id: number): Promise<void> {
  const { error } = await supabase
    .from("vehicle_records")
    .update({
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .is("deleted_at", null);

  if (error) {
    throw error;
  }
}
