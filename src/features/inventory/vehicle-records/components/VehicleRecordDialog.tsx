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

export default function VehicleRecordDialog({ open, vehicle, onClose }: Props) {
  const createMutation = useCreateVehicleRecord();

  const updateMutation = useUpdateVehicleRecord();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,

    formState: { errors, isSubmitting },
  } = useForm<VehicleRecordFormValues>({
    resolver: zodResolver(vehicleRecordSchema),

    defaultValues: emptyValues,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchedModel = watch("model");
  const watchedPlateNo = watch("plate_no");

  console.log("VEHICLE FORM STATE:", {
    model: watchedModel,
    plate_no: watchedPlateNo,
  });

  const isEditing = Boolean(vehicle);

  const loading =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) {
      return;
    }

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
  }, [open, vehicle, reset]);

  function handleClose() {
    if (loading) return;

    onClose();
  }

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

      onClose();
    } catch (error) {
      if (isPostgresDuplicateError(error)) {
        const message = getDuplicateMessage(error);

        if (message.includes("plate")) {
          setError("plate_no", {
            message: "This plate number already exists.",
          });

          return;
        }

        if (message.includes("engine")) {
          setError("engine_no", {
            message: "This engine number already exists.",
          });

          return;
        }

        if (message.includes("chassis")) {
          setError("chassis_no", {
            message: "This chassis number already exists.",
          });

          return;
        }
      }

      setError("root", {
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
            ? "Update the municipal vehicle record and assignment information."
            : "Create a municipal vehicle record with identification, assignment, and property details."}
        </p>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <DialogBody>
          <div className="space-y-7">
            {errors.root?.message && (
              <div
                className="
                  flex gap-3
                  rounded-md border
                  border-red-200
                  bg-red-50
                  px-4 py-3

                  dark:border-red-900
                  dark:bg-red-950/30
                "
              >
                <AlertTriangle
                  size={18}
                  className="
                    mt-0.5
                    shrink-0
                    text-red-600
                    dark:text-red-400
                  "
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

            {/* Vehicle identification */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Vehicle Identification
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Basic identifying information for the municipal vehicle.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField label="Model" required>
                  <FormInput
                    {...register("model")}
                    placeholder="e.g. Toyota Hilux"
                  />

                  {errors.model?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.model.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Plate No." required>
                  <FormInput
                    {...register("plate_no")}
                    placeholder="e.g. ABC-1234"
                    className="uppercase"
                  />

                  {errors.plate_no?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.plate_no.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Engine No.">
                  <FormInput
                    {...register("engine_no")}
                    placeholder="Engine number"
                  />

                  {errors.engine_no?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.engine_no.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Chassis No.">
                  <FormInput
                    {...register("chassis_no")}
                    placeholder="Chassis number"
                  />

                  {errors.chassis_no?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.chassis_no.message}
                    </p>
                  )}
                </FormField>
              </div>
            </section>

            {/* Assignment */}
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
                  Record the office, accountable document, driver, and contact
                  details.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField label="Office">
                  <FormInput
                    {...register("office")}
                    placeholder="Assigned office"
                  />
                </FormField>

                <FormField label="M.R. / Memorandum Receipt">
                  <FormInput
                    {...register("memorandum_receipt")}
                    placeholder="Memorandum receipt"
                  />
                </FormField>

                <FormField label="Driver">
                  <FormInput
                    {...register("driver")}
                    placeholder="Driver name"
                  />
                </FormField>

                <FormField label="Cellphone No.">
                  <FormInput
                    {...register("cellphone_no")}
                    placeholder="e.g. 09XX XXX XXXX"
                  />
                </FormField>
              </div>
            </section>

            {/* Property */}
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
                  Acquisition, property, cost and registration information.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <FormField label="Property No.">
                  <FormInput
                    {...register("property_no")}
                    placeholder="Property number"
                  />
                </FormField>

                <FormField label="Date Acquired">
                  <FormInput type="date" {...register("date_acquired")} />
                </FormField>

                <FormField label="Cost">
                  <FormInput
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("cost")}
                    placeholder="0.00"
                  />

                  {errors.cost?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.cost.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Expiration Date">
                  <FormInput type="date" {...register("expiration_date")} />
                </FormField>
              </div>
            </section>
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
            {isEditing ? "Save Changes" : "Add Vehicle"}
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

function isPostgresDuplicateError(error: unknown) {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && error.code === "23505";
}

function getDuplicateMessage(error: unknown) {
  if (
    typeof error !== "object" ||
    error === null ||
    !("message" in error) ||
    typeof error.message !== "string"
  ) {
    return "";
  }

  return error.message.toLowerCase();
}
