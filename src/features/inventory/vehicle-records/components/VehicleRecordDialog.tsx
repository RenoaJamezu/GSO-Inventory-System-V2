import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { FormField, FormInput } from "@/components/form";

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
    formState: { errors, isSubmitting },
  } = useForm<VehicleRecordFormValues>({
    resolver: zodResolver(vehicleRecordSchema),
    defaultValues: emptyValues,
  });

  const isEditing = Boolean(vehicle);

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

  const loading =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl">
      <DialogHeader title={isEditing ? "Edit Vehicle" : "Add Vehicle"}>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close"
        >
          <X size={18} />
        </button>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="space-y-6">
            {errors.root?.message && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errors.root.message}
              </div>
            )}

            {/* Vehicle Information */}
            <section>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Vehicle Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Model" required>
                  <FormInput
                    {...register("model")}
                    placeholder="e.g. Toyota Hilux"
                  />

                  {errors.model && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.model.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Plate No." required>
                  <FormInput
                    {...register("plate_no")}
                    placeholder="e.g. ABC-1234"
                  />

                  {errors.plate_no && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.plate_no.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Engine No.">
                  <FormInput
                    {...register("engine_no")}
                    placeholder="Engine number"
                  />

                  {errors.engine_no && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.engine_no.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Chassis No.">
                  <FormInput
                    {...register("chassis_no")}
                    placeholder="Chassis number"
                  />

                  {errors.chassis_no && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.chassis_no.message}
                    </p>
                  )}
                </FormField>
              </div>
            </section>

            <div className="border-t border-gray-200" />

            {/* Assignment */}
            <section>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Assignment Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

            <div className="border-t border-gray-200" />

            {/* Property */}
            <section>
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Property Information
              </h3>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

                  {errors.cost && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.cost.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Date Expiration">
                  <FormInput type="date" {...register("expiration_date")} />
                </FormField>
              </div>
            </section>
          </div>
        </DialogBody>

        <DialogFooter>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditing ? "Save Changes" : "Add Vehicle"}
          </button>
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
