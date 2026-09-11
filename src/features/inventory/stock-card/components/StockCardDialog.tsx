import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { FormField, FormInput, FormTextarea } from "@/components/form";

import { Button } from "@/components/ui";

import { useCreateStockCard, useUpdateStockCard } from "../hooks/useStockCards";

import {
  stockCardSchema,
  type StockCardFormValues,
} from "../schemas/stockCard.schema";

import type { StockCard } from "../types";

type Props = {
  open: boolean;
  stockCard?: StockCard | null;
  onClose: () => void;
};

const defaultValues: StockCardFormValues = {
  item: "",
  stock_no: "",
  description: "",
  unit_of_measurement: "",
  reorder_point: "",
};

export default function StockCardDialog({ open, stockCard, onClose }: Props) {
  const createStockCard = useCreateStockCard();
  const updateStockCard = useUpdateStockCard();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockCardFormValues>({
    resolver: zodResolver(stockCardSchema),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;

    if (stockCard) {
      reset({
        item: stockCard.item,
        stock_no: stockCard.stock_no,
        description: stockCard.description ?? "",
        unit_of_measurement: stockCard.unit_of_measurement,
        reorder_point: String(stockCard.reorder_point),
      });

      return;
    }

    reset(defaultValues);
  }, [open, stockCard, reset]);

  const isPending = createStockCard.isPending || updateStockCard.isPending;

  async function onSubmit(values: StockCardFormValues) {
    const input = {
      item: values.item.trim(),
      stock_no: values.stock_no.trim(),
      description: values.description.trim() || null,
      unit_of_measurement: values.unit_of_measurement.trim(),
      reorder_point: Number(values.reorder_point),
    };

    if (stockCard) {
      await updateStockCard.mutateAsync({
        id: stockCard.id,
        input,
      });
    } else {
      await createStockCard.mutateAsync(input);
    }

    onClose();
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader title={stockCard ? "Edit Stock Card" : "Create Stock Card"}>
        <button
          type="button"
          onClick={onClose}
          className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="space-y-4">
            <FormField label="Item" required>
              <FormInput
                {...register("item")}
                placeholder="e.g. Bond Paper A4"
              />

              {errors.item?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.item.message}
                </p>
              )}
            </FormField>

            <FormField label="Stock No." required>
              <FormInput {...register("stock_no")} placeholder="e.g. OS-001" />

              {errors.stock_no?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.stock_no.message}
                </p>
              )}
            </FormField>

            <FormField label="Description">
              <FormTextarea
                {...register("description")}
                placeholder="Enter item description"
              />

              {errors.description?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </FormField>

            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Unit of Measurement" required>
                <FormInput
                  {...register("unit_of_measurement")}
                  placeholder="e.g. Ream"
                />

                {errors.unit_of_measurement?.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.unit_of_measurement.message}
                  </p>
                )}
              </FormField>

              <FormField label="Re-order Point">
                <FormInput {...register("reorder_point")} placeholder="0" />

                {errors.reorder_point?.message && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.reorder_point.message}
                  </p>
                )}
              </FormField>
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Saving..."
              : stockCard
                ? "Save Changes"
                : "Create Stock Card"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
