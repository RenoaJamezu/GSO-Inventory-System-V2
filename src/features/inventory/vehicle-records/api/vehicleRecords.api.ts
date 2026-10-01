import { supabase } from "@/lib/supabase";

import type { VehicleRecord, VehicleRecordInput } from "../types";
import type { MotorVehicleInventoryOption } from "../../inventory-records/types";

const vehicleRecordSelect = `
  *,
  inventory_record:inventory_records!vehicle_records_inventory_record_id_fkey (
    id,
    account_id,
    inventory_type,
    qr_uuid,
    data,
    created_at,
    updated_at,
    deleted_at
  )
`;

export async function getAvailableMotorVehicleInventoryRecords(
  currentInventoryRecordId?: number | null,
): Promise<MotorVehicleInventoryOption[]> {
  const { data: account, error: accountError } = await supabase
    .from("inventory_accounts")
    .select("id")
    .eq("system_key", "MOTOR_VEHICLES")
    .is("deleted_at", null)
    .single();

  if (accountError) {
    throw accountError;
  }

  const { data: inventoryRecords, error: inventoryError } = await supabase
    .from("inventory_records")
    .select("id, inventory_type, data")
    .eq("account_id", account.id)
    .is("deleted_at", null)
    .order("id", {
      ascending: true,
    });

  if (inventoryError) {
    throw inventoryError;
  }

  const { data: linkedVehicles, error: vehicleError } = await supabase
    .from("vehicle_records")
    .select("inventory_record_id")
    .not("inventory_record_id", "is", null)
    .is("deleted_at", null);

  if (vehicleError) {
    throw vehicleError;
  }

  const unavailableIds = new Set(
    (linkedVehicles ?? [])
      .map((vehicle) => vehicle.inventory_record_id)
      .filter(
        (id): id is number =>
          typeof id === "number" && id !== currentInventoryRecordId,
      ),
  );

  return (inventoryRecords ?? []).filter(
    (record) => !unavailableIds.has(record.id),
  ) as MotorVehicleInventoryOption[];
}

export async function getVehicleRecords(): Promise<VehicleRecord[]> {
  const { data, error } = await supabase
    .from("vehicle_records")
    .select(vehicleRecordSelect)
    .is("deleted_at", null)
    .order("plate_no", {
      ascending: true,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as VehicleRecord[];
}

export async function getVehicleRecord(id: number): Promise<VehicleRecord> {
  const { data, error } = await supabase
    .from("vehicle_records")
    .select(vehicleRecordSelect)
    .eq("id", id)
    .is("deleted_at", null)
    .single();

  if (error) {
    throw error;
  }

  return data as VehicleRecord;
}

export async function createVehicleRecord(
  values: VehicleRecordInput,
): Promise<VehicleRecord> {
  const { data, error } = await supabase
    .from("vehicle_records")
    .insert(values)
    .select(vehicleRecordSelect)
    .single();

  if (error) {
    throw error;
  }

  return data as VehicleRecord;
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
    .select(vehicleRecordSelect)
    .single();

  if (error) {
    throw error;
  }

  return data as VehicleRecord;
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

export async function bulkDeleteVehicleRecords(ids: number[]): Promise<void> {
  if (ids.length === 0) {
    return;
  }

  const now = new Date().toISOString();

  const { error } = await supabase
    .from("vehicle_records")
    .update({
      deleted_at: now,
      updated_at: now,
    })
    .in("id", ids)
    .is("deleted_at", null);

  if (error) {
    throw error;
  }
}
