import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { FormField, FormInput } from "@/components/form";
import { Button } from "@/components/ui";

import {
  useAvailableMotorVehicleInventoryRecords,
  useCreateVehicleRecord,
  useUpdateVehicleRecord,
} from "../hooks/useVehicleRecords";

import {
  vehicleRecordSchema,
  type VehicleRecordFormValues,
} from "../schemas/vehicleRecord.schema";

import type { VehicleRecord, VehicleRecordInput } from "../types";
import VehicleInventorySelect from "./VehicleInventorySelect";

type Props = {
  open: boolean;
  vehicle?: VehicleRecord | null;
  onClose: () => void;
};

const emptyValues: VehicleRecordFormValues = {
  inventory_record_id: 0,
  model: "",
  engine_no: "",
  chassis_no: "",
  office: "",
  memorandum_receipt: "",
  driver: "",
  cellphone_no: "",
  expiration_date: "",
  date_acquired: "",
};

export default function VehicleRecordDialog({ open, vehicle, onClose }: Props) {
  const createMutation = useCreateVehicleRecord();
  const updateMutation = useUpdateVehicleRecord();

  const isEdit = Boolean(vehicle);

  const inventoryQuery = useAvailableMotorVehicleInventoryRecords(
    vehicle?.inventory_record_id,
  );

  const {
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VehicleRecordFormValues>({
    resolver: zodResolver(vehicleRecordSchema),
    defaultValues: emptyValues,
  });

  const inventoryRecordId = useWatch({
    control,
    name: "inventory_record_id",
  });

  const inventoryRecords = useMemo(
    () => inventoryQuery.data ?? [],
    [inventoryQuery.data],
  );

  const selectedInventoryRecord = useMemo(
    () =>
      inventoryRecords.find((record) => record.id === inventoryRecordId) ??
      null,
    [inventoryRecords, inventoryRecordId],
  );

  const inventoryData = selectedInventoryRecord?.data ?? {};

  const loading =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) return;

    if (vehicle) {
      reset({
        inventory_record_id: vehicle.inventory_record_id ?? 0,
        model: vehicle.model ?? "",
        engine_no: vehicle.engine_no ?? "",
        chassis_no: vehicle.chassis_no ?? "",
        office: vehicle.office ?? "",
        memorandum_receipt: vehicle.memorandum_receipt ?? "",
        driver: vehicle.driver ?? "",
        cellphone_no: vehicle.cellphone_no ?? "",
        expiration_date: vehicle.expiration_date ?? "",
        date_acquired: vehicle.date_acquired ?? "",
      });

      return;
    }

    reset(emptyValues);
  }, [open, vehicle, reset]);

  async function onSubmit(values: VehicleRecordFormValues) {
    const isLegacyUnlinkedEdit =
      isEdit && vehicle?.inventory_record_id === null;

    if (!isLegacyUnlinkedEdit && values.inventory_record_id <= 0) {
      setError("inventory_record_id", {
        type: "server",
        message: "Motor Vehicle inventory record is required.",
      });

      return;
    }

    const selectedRecord =
      values.inventory_record_id > 0
        ? inventoryRecords.find(
            (record) => record.id === values.inventory_record_id,
          )
        : null;

    if (values.inventory_record_id > 0 && !selectedRecord) {
      setError("inventory_record_id", {
        type: "server",
        message: "Select a valid Motor Vehicle inventory record.",
      });

      return;
    }

    const data = selectedRecord?.data ?? {};

    const payload: VehicleRecordInput = {
      inventory_record_id: selectedRecord?.id ?? null,

      model: values.model.trim(),

      engine_no: toNullableString(values.engine_no),
      chassis_no: toNullableString(values.chassis_no),

      plate_no: selectedRecord
        ? getInventoryString(data, "plate_number").toUpperCase()
        : (vehicle?.plate_no ?? ""),

      office: toNullableString(values.office),
      memorandum_receipt: toNullableString(values.memorandum_receipt),

      driver: toNullableString(values.driver),
      cellphone_no: toNullableString(values.cellphone_no),

      expiration_date: toNullableString(values.expiration_date),

      property_no: selectedRecord
        ? toNullableString(getInventoryString(data, "property_number"))
        : (vehicle?.property_no ?? null),

      date_acquired: toNullableString(values.date_acquired),

      cost: selectedRecord
        ? getInventoryNumber(data, "unit_value")
        : (vehicle?.cost ?? null),
    };

    try {
      if (isEdit && vehicle) {
        await updateMutation.mutateAsync({
          id: vehicle.id,
          values: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      onClose();
    } catch (error) {
      console.error("Failed saving vehicle record", error);

      if (isPostgresDuplicateError(error)) {
        const message = getDuplicateMessage(error);

        if (message.includes("inventory_record")) {
          setError("inventory_record_id", {
            type: "server",
            message:
              "This inventory record is already linked to another vehicle.",
          });

          return;
        }

        if (message.includes("engine")) {
          setError("engine_no", {
            type: "server",
            message: "This engine number already exists.",
          });

          return;
        }

        if (message.includes("chassis")) {
          setError("chassis_no", {
            type: "server",
            message: "This chassis number already exists.",
          });

          return;
        }
      }

      setError("root", {
        type: "server",
        message: "Unable to save vehicle record. Please try again.",
      });
    }
  }

  function handleClose() {
    if (loading) return;

    onClose();
  }

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={loading ? undefined : handleClose}
    >
      <DialogHeader title={isEdit ? "Edit Vehicle" : "Add Vehicle"}>
        <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
          {isEdit
            ? "Update the vehicle details and linked inventory record."
            : "Select a Motor Vehicle inventory record and add its vehicle details."}
        </p>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <DialogBody>
          <div className="space-y-6">
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Motor Vehicle Inventory
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Select the inventory asset associated with this vehicle.
                </p>
              </div>

              <FormField label="Motor Vehicle" required>
                <VehicleInventorySelect
                  value={inventoryRecordId}
                  options={inventoryRecords}
                  disabled={loading || inventoryQuery.isLoading}
                  onChange={(value) => {
                    setValue("inventory_record_id", value, {
                      shouldDirty: true,
                      shouldValidate: true,
                    });
                  }}
                />

                {errors.inventory_record_id && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.inventory_record_id.message}
                  </p>
                )}

                {inventoryQuery.isError && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Unable to load Motor Vehicle inventory records.
                  </p>
                )}
              </FormField>
            </section>

            {selectedInventoryRecord && (
              <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Inventory Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    These values come directly from the Inventory module.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <ReadOnlyField
                    label="Description"
                    value={getInventoryString(inventoryData, "description")}
                  />

                  <ReadOnlyField
                    label="Plate Number"
                    value={getInventoryString(inventoryData, "plate_number")}
                  />

                  <ReadOnlyField
                    label="Property Number"
                    value={getInventoryString(inventoryData, "property_number")}
                  />

                  <ReadOnlyField
                    label="Unit Value"
                    value={formatCurrency(
                      getInventoryNumber(inventoryData, "unit_value"),
                    )}
                  />

                  <ReadOnlyField
                    label="Inventory Date"
                    value={getInventoryString(inventoryData, "date")}
                  />

                  <ReadOnlyField
                    label="Inventory Type"
                    value={formatInventoryType(
                      selectedInventoryRecord.inventory_type,
                    )}
                  />
                </div>
              </section>
            )}

            <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Additional Vehicle Information
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter information specific to the vehicle record.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Model" required>
                  <FormInput
                    placeholder="e.g. Toyota Hilux"
                    className="uppercase"
                    {...register("model")}
                  />

                  {errors.model && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.model.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Engine No.">
                  <FormInput
                    placeholder="Enter engine number"
                    className="uppercase"
                    {...register("engine_no")}
                  />

                  {errors.engine_no && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.engine_no.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Chassis No.">
                  <FormInput
                    placeholder="Enter chassis number"
                    className="uppercase"
                    {...register("chassis_no")}
                  />

                  {errors.chassis_no && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.chassis_no.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Office">
                  <FormInput
                    placeholder="Enter assigned office"
                    className="uppercase"
                    {...register("office")}
                  />
                </FormField>

                <FormField label="Memorandum Receipt">
                  <FormInput
                    placeholder="Enter memorandum receipt"
                    className="uppercase"
                    {...register("memorandum_receipt")}
                  />
                </FormField>

                <FormField label="Driver">
                  <FormInput
                    placeholder="Enter driver's name"
                    className="uppercase"
                    {...register("driver")}
                  />
                </FormField>

                <FormField label="Cellphone No.">
                  <FormInput
                    placeholder="e.g. 09171234567"
                    inputMode="tel"
                    {...register("cellphone_no")}
                  />
                </FormField>

                <FormField label="Expiration Date">
                  <FormInput type="date" {...register("expiration_date")} />
                </FormField>

                <FormField label="Date Acquired">
                  <FormInput type="date" {...register("date_acquired")} />
                </FormField>
              </div>
            </section>

            {errors.root?.message && (
              <div className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-900/60 dark:bg-red-950/30">
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                />

                <div>
                  <p className="text-sm font-medium text-red-700 dark:text-red-300">
                    Unable to save vehicle
                  </p>

                  <p className="mt-0.5 text-sm text-red-600 dark:text-red-400">
                    {errors.root.message}
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            loading={loading}
            disabled={inventoryQuery.isLoading || inventoryQuery.isError}
          >
            {isEdit ? "Save Changes" : "Add Vehicle"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {label}
      </p>

      <p className="mt-1 min-h-5 wrap-break-word text-sm font-medium uppercase text-slate-900 dark:text-slate-100">
        {value || "—"}
      </p>
    </div>
  );
}

function getInventoryString(
  data: Record<string, unknown>,
  key: string,
): string {
  const value = data[key];

  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

function getInventoryNumber(
  data: Record<string, unknown>,
  key: string,
): number | null {
  const value = data[key];

  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value.replace(/,/g, ""));

    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function formatCurrency(value: number | null): string {
  if (value === null) {
    return "";
  }

  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

function formatInventoryType(value: string): string {
  switch (value) {
    case "HIGH_COST":
      return "High Cost";

    case "LOW_COST":
      return "Low Cost";

    case "PAR":
      return "PAR";

    default:
      return value.replaceAll("_", " ");
  }
}

function toNullableString(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

function isPostgresDuplicateError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && error.code === "23505";
}

function getDuplicateMessage(error: unknown): string {
  if (typeof error !== "object" || error === null) {
    return "";
  }

  const parts: string[] = [];

  if ("message" in error && typeof error.message === "string") {
    parts.push(error.message);
  }

  if ("details" in error && typeof error.details === "string") {
    parts.push(error.details);
  }

  if ("hint" in error && typeof error.hint === "string") {
    parts.push(error.hint);
  }

  return parts.join(" ").toLowerCase();
}
