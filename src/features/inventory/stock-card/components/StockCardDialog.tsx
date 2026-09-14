import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import type { StockCard, StockCardInput } from "../types";

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

  const isPending = createStockCard.isPending || updateStockCard.isPending;

  useEffect(() => {
    if (!open) return;

    if (stockCard) {
      reset({
        item: stockCard.item,
        stock_no: stockCard.stock_no,

        description: stockCard.description ?? "",

        unit_of_measurement: stockCard.unit_of_measurement,

        reorder_point:
          stockCard.reorder_point === null
            ? ""
            : String(stockCard.reorder_point),
      });

      return;
    }

    reset(defaultValues);
  }, [open, stockCard, reset]);

  function handleClose() {
    if (isPending) return;

    onClose();
  }

  async function onSubmit(values: StockCardFormValues) {
    const reorderPoint = values.reorder_point.trim();

    const input: StockCardInput = {
      item: values.item.trim(),

      stock_no: values.stock_no.trim(),

      description: values.description.trim() || null,

      unit_of_measurement: values.unit_of_measurement.trim(),

      reorder_point: reorderPoint === "" ? null : Number(reorderPoint),
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
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={isPending ? undefined : handleClose}
    >
      <DialogHeader title={stockCard ? "Edit Stock Item" : "Add Stock Item"}>
        <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
          {stockCard
            ? "Update the information for this stock card item."
            : "Create an item that can receive and issue stock transactions."}
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
                  Item Information
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter the identifying information for the stock item.
                </p>
              </div>

              <FormField label="Item" required>
                <FormInput
                  {...register("item")}
                  placeholder="e.g. Bond Paper A4"
                />

                {errors.item?.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.item.message}
                  </p>
                )}
              </FormField>

              <FormField label="Stock No." required>
                <FormInput
                  {...register("stock_no")}
                  placeholder="e.g. OS-001"
                />

                {errors.stock_no?.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.stock_no.message}
                  </p>
                )}
              </FormField>

              <FormField label="Description">
                <FormTextarea
                  rows={3}
                  {...register("description")}
                  placeholder="Enter item description"
                />

                {errors.description?.message && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.description.message}
                  </p>
                )}
              </FormField>
            </section>

            <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Stock Settings
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Configure the item's unit and optional re-order threshold.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Unit of Measurement" required>
                  <FormInput
                    {...register("unit_of_measurement")}
                    placeholder="e.g. Ream"
                  />

                  {errors.unit_of_measurement?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.unit_of_measurement.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Re-order Point">
                  <FormInput
                    type="number"
                    min="0"
                    step="1"
                    {...register("reorder_point")}
                    placeholder="Leave blank if unspecified"
                  />

                  {errors.reorder_point?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.reorder_point.message}
                    </p>
                  )}

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Leave blank when no re-order point has been specified.
                  </p>
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
            disabled={isPending}
          >
            Cancel
          </Button>

          <Button type="submit" loading={isPending}>
            {stockCard ? "Save Changes" : "Create Stock Item"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
