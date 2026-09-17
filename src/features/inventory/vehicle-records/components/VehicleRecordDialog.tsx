import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AlertTriangle } from "lucide-react";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { FormField, FormInput, FormNumberInput } from "@/components/form";
import { Button } from "@/components/ui";

import {
  useCreateVehicleRecord,
  useUpdateVehicleRecord,
} from "../hooks/useVehicleRecords";

import {
  vehicleRecordSchema,
  type VehicleRecordFormValues,
} from "../schemas/vehicleRecord.schema";

import type { VehicleRecord, VehicleRecordInput } from "../types";

type Props = {
  open: boolean;
  vehicle?: VehicleRecord | null;
  onClose: () => void;
};

const emptyValues: VehicleRecordFormValues = {
  model: "",
  engine_no: "",
  chassis_no: "",
  plate_no: "",
  office: "",
  memorandum_receipt: "",
  driver: "",
  cellphone_no: "",
  expiration_date: "",
  property_no: "",
  date_acquired: "",
  cost: null,
};

export default function VehicleRecordDialog({ open, vehicle, onClose }: Props) {
  const createMutation = useCreateVehicleRecord();
  const updateMutation = useUpdateVehicleRecord();

  const isEdit = Boolean(vehicle);

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

  const cost = useWatch({
    control,
    name: "cost",
  });

  const loading =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) return;

    if (vehicle) {
      reset({
        model: vehicle.model ?? "",
        engine_no: vehicle.engine_no ?? "",
        chassis_no: vehicle.chassis_no ?? "",
        plate_no: vehicle.plate_no ?? "",
        office: vehicle.office ?? "",
        memorandum_receipt: vehicle.memorandum_receipt ?? "",
        driver: vehicle.driver ?? "",
        cellphone_no: vehicle.cellphone_no ?? "",
        expiration_date: vehicle.expiration_date ?? "",
        property_no: vehicle.property_no ?? "",
        date_acquired: vehicle.date_acquired ?? "",
        cost: vehicle.cost,
      });

      return;
    }

    reset(emptyValues);
  }, [open, vehicle, reset]);

  async function onSubmit(values: VehicleRecordFormValues) {
    const payload: VehicleRecordInput = {
      model: values.model.trim(),

      engine_no: toNullableString(values.engine_no),
      chassis_no: toNullableString(values.chassis_no),

      plate_no: values.plate_no.trim().toUpperCase(),

      office: toNullableString(values.office),
      memorandum_receipt: toNullableString(values.memorandum_receipt),

      driver: toNullableString(values.driver),
      cellphone_no: toNullableString(values.cellphone_no),

      expiration_date: toNullableString(values.expiration_date),

      property_no: toNullableString(values.property_no),
      date_acquired: toNullableString(values.date_acquired),

      cost: values.cost,
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

        if (message.includes("plate")) {
          setError("plate_no", {
            type: "server",
            message: "This plate number already exists.",
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
      maxWidth="sm"
      onClose={loading ? undefined : handleClose}
    >
      <DialogHeader title={isEdit ? "Edit Vehicle" : "Add Vehicle"}>
        <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
          {isEdit
            ? "Update the information for this municipal vehicle."
            : "Create a new municipal vehicle record."}
        </p>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <DialogBody>
          <div className="space-y-6">
            {/* Vehicle Identification */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Vehicle Identification
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Basic identifying information for the municipal vehicle.
                </p>
              </div>

              <div className="grid gap-4">
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

                <FormField label="Plate No." required>
                  <FormInput
                    placeholder="e.g. ABC-1234"
                    className="uppercase"
                    {...register("plate_no")}
                  />

                  {errors.plate_no && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.plate_no.message}
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
              </div>
            </section>

            {/* Assignment Information */}
            <section
              className="
                space-y-4
                border-t
                border-slate-200
                pt-6

                dark:border-slate-800
              "
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Assignment Information
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Record the assigned office, accountable document, driver, and
                  contact information.
                </p>
              </div>

              <div className="grid gap-4">
                <FormField label="Office">
                  <FormInput
                    placeholder="Enter assigned office"
                    className="uppercase"
                    {...register("office")}
                  />

                  {errors.office && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.office.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Memorandum Receipt">
                  <FormInput
                    placeholder="Enter memorandum receipt"
                    className="uppercase"
                    {...register("memorandum_receipt")}
                  />

                  {errors.memorandum_receipt && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.memorandum_receipt.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Driver">
                  <FormInput
                    placeholder="Enter driver's name"
                    className="uppercase"
                    {...register("driver")}
                  />

                  {errors.driver && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.driver.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Cellphone No.">
                  <FormInput
                    placeholder="e.g. 09171234567"
                    className="uppercase"
                    inputMode="tel"
                    {...register("cellphone_no")}
                  />

                  {errors.cellphone_no && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.cellphone_no.message}
                    </p>
                  )}
                </FormField>
              </div>
            </section>

            {/* Property and Registration */}
            <section
              className="
                space-y-4
                border-t
                border-slate-200
                pt-6

                dark:border-slate-800
              "
            >
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Property and Registration
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Property, acquisition, cost, and registration information.
                </p>
              </div>

              <div className="grid gap-4">
                <FormField label="Property No.">
                  <FormInput
                    placeholder="Enter property number"
                    className="uppercase"
                    {...register("property_no")}
                  />

                  {errors.property_no && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.property_no.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Date Acquired">
                  <FormInput
                    type="date"
                    className="uppercase"
                    {...register("date_acquired")}
                  />

                  {errors.date_acquired && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.date_acquired.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Cost">
                  <FormNumberInput
                    value={cost}
                    onValueChange={(value) => {
                      setValue("cost", value ?? null, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                    min={0}
                    maximumFractionDigits={2}
                    placeholder="0.00"
                  />

                  {errors.cost && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.cost.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Expiration Date">
                  <FormInput
                    type="date"
                    className="uppercase"
                    {...register("expiration_date")}
                  />

                  {errors.expiration_date && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.expiration_date.message}
                    </p>
                  )}
                </FormField>
              </div>
            </section>

            {/* General server error */}
            {errors.root?.message && (
              <div
                className="
                  flex items-start gap-3
                  rounded-md
                  border border-red-200
                  bg-red-50
                  p-3

                  dark:border-red-900/60
                  dark:bg-red-950/30
                "
              >
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

          <Button type="submit" loading={loading}>
            {isEdit ? "Save Changes" : "Add Vehicle"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
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
