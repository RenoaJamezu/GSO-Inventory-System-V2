import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
  vehicleRecordSchema,
  type VehicleRecordFormValues,
} from "../schemas/vehicleRecord.schema";

import {
  useCreateVehicleRecord,
  useUpdateVehicleRecord,
} from "../hooks/useVehicleRecords";

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
  cost: "",
};

function toNullableString(value: string): string | null {
  const trimmed = value.trim();

  return trimmed === "" ? null : trimmed;
}

function isPostgresDuplicateError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  if ("code" in error && error.code === "23505") {
    return true;
  }

  return false;
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

export default function VehicleRecordDialog({ open, vehicle, onClose }: Props) {
  const createMutation = useCreateVehicleRecord();
  const updateMutation = useUpdateVehicleRecord();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    clearErrors,

    formState: { errors, isSubmitting },
  } = useForm<VehicleRecordFormValues>({
    resolver: zodResolver(vehicleRecordSchema),

    defaultValues: emptyValues,

    // Validate again as soon as the user changes a field.
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const isEditing = Boolean(vehicle);

  const loading =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) {
      return;
    }

    clearErrors();

    if (!vehicle) {
      reset(emptyValues);
      return;
    }

    reset({
      model: vehicle.model,

      engine_no: vehicle.engine_no ?? "",

      chassis_no: vehicle.chassis_no ?? "",

      plate_no: vehicle.plate_no,

      office: vehicle.office ?? "",

      memorandum_receipt: vehicle.memorandum_receipt ?? "",

      driver: vehicle.driver ?? "",

      cellphone_no: vehicle.cellphone_no ?? "",

      expiration_date: vehicle.expiration_date ?? "",

      property_no: vehicle.property_no ?? "",

      date_acquired: vehicle.date_acquired ?? "",

      cost: vehicle.cost !== null ? String(vehicle.cost) : "",
    });
  }, [open, vehicle, reset, clearErrors]);

  function handleClose() {
    if (loading) return;

    clearErrors();
    onClose();
  }

  async function onSubmit(values: VehicleRecordFormValues) {
    /*
     * Clear any previous server-side errors before
     * attempting another submission.
     */
    clearErrors("root");

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

      cost: values.cost.trim() === "" ? null : Number(values.cost),
    };

    try {
      if (vehicle) {
        await updateMutation.mutateAsync({
          id: vehicle.id,
          values: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      reset(emptyValues);
      clearErrors();

      onClose();
    } catch (error) {
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

      console.error("Failed saving vehicle record:", error);

      setError("root", {
        type: "server",
        message: "Unable to save vehicle record. Please try again.",
      });
    }
  }

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : handleClose}
      maxWidth="sm"
    >
      <DialogHeader title={isEditing ? "Edit Vehicle" : "Add Vehicle"}>
        <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
          {isEditing
            ? "Update the information for this vehicle record."
            : "Enter the information for the new vehicle record."}
        </p>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <DialogBody>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Vehicle Identification
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Basic identifying information for the municipal vehicle.
              </p>
            </div>
            {/* MODEL */}
            <FormField label="Model" required>
              <FormInput
                {...register("model", {
                  onChange: () => {
                    clearErrors("model");
                    clearErrors("root");
                  },
                })}
                placeholder="e.g. Toyota Hilux"
                autoComplete="off"
              />

              {errors.model && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.model.message}
                </p>
              )}
            </FormField>

            {/* PLATE NUMBER */}
            <FormField label="Plate No." required>
              <FormInput
                {...register("plate_no", {
                  onChange: () => {
                    clearErrors("plate_no");
                    clearErrors("root");
                  },
                })}
                placeholder="e.g. ABC-1234"
                autoComplete="off"
                className="uppercase"
              />

              {errors.plate_no && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.plate_no.message}
                </p>
              )}
            </FormField>

            {/* ENGINE NUMBER */}
            <FormField label="Engine No.">
              <FormInput
                {...register("engine_no", {
                  onChange: () => {
                    clearErrors("engine_no");
                    clearErrors("root");
                  },
                })}
                placeholder="Enter engine number"
                autoComplete="off"
              />

              {errors.engine_no && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.engine_no.message}
                </p>
              )}
            </FormField>

            {/* CHASSIS NUMBER */}
            <FormField label="Chassis No.">
              <FormInput
                {...register("chassis_no", {
                  onChange: () => {
                    clearErrors("chassis_no");
                    clearErrors("root");
                  },
                })}
                placeholder="Enter chassis number"
                autoComplete="off"
              />

              {errors.chassis_no && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.chassis_no.message}
                </p>
              )}
            </FormField>

            <div
              className="
                space-y-4
                border-t
                border-slate-200
                pt-6

                dark:border-slate-800
              "
            />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Assignment Information
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Record the office, accountable document, driver, and contact details.
              </p>
            </div>

            {/* OFFICE */}
            <FormField label="Office">
              <FormInput
                {...register("office")}
                placeholder="Enter assigned office"
              />

              {errors.office && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.office.message}
                </p>
              )}
            </FormField>

            {/* MEMORANDUM RECEIPT */}
            <FormField label="Memorandum Receipt">
              <FormInput
                {...register("memorandum_receipt")}
                placeholder="Enter memorandum receipt"
              />

              {errors.memorandum_receipt && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.memorandum_receipt.message}
                </p>
              )}
            </FormField>

            {/* DRIVER */}
            <FormField label="Driver">
              <FormInput
                {...register("driver")}
                placeholder="Enter driver's name"
              />

              {errors.driver && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.driver.message}
                </p>
              )}
            </FormField>

            {/* CELLPHONE */}
            <FormField label="Cellphone No.">
              <FormInput
                {...register("cellphone_no")}
                placeholder="e.g. 09171234567"
                inputMode="tel"
              />

              {errors.cellphone_no && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.cellphone_no.message}
                </p>
              )}
            </FormField>

            <div
              className="
                space-y-4
                border-t
                border-slate-200
                pt-6

                dark:border-slate-800
              "
            />
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Property and Registration
              </h3>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Acquisition, property, cost and registration information.
              </p>
            </div>

            {/* PROPERTY NUMBER */}
            <FormField label="Property No.">
              <FormInput
                {...register("property_no")}
                placeholder="Enter property number"
              />

              {errors.property_no && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.property_no.message}
                </p>
              )}
            </FormField>

            {/* DATE ACQUIRED */}
            <FormField label="Date Acquired">
              <FormInput {...register("date_acquired")} type="date" />

              {errors.date_acquired && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.date_acquired.message}
                </p>
              )}
            </FormField>

            {/* COST */}
            <FormField label="Cost">
              <FormInput
                {...register("cost")}
                type="number"
                min="0"
                step="0.01"
                inputMode="decimal"
                placeholder="0.00"
              />

              {errors.cost && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.cost.message}
                </p>
              )}
            </FormField>

            {/* EXPIRATION */}
            <FormField label="Expiration Date">
              <FormInput {...register("expiration_date")} type="date" />

              {errors.expiration_date && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.expiration_date.message}
                </p>
              )}
            </FormField>

            {/* SERVER ERROR */}
            {errors.root?.message && (
              <div
                className="
                  flex items-start gap-2
                  rounded-md
                  border border-red-200
                  bg-red-50
                  p-3
                  text-sm text-red-700

                  dark:border-red-900/60
                  dark:bg-red-950/30
                  dark:text-red-400
                "
              >
                <AlertTriangle size={17} className="mt-0.5 shrink-0" />

                <p>{errors.root.message}</p>
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

          <Button type="submit" disabled={loading}>
            {loading
              ? isEditing
                ? "Saving..."
                : "Adding..."
              : isEditing
                ? "Save Changes"
                : "Add Vehicle"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
