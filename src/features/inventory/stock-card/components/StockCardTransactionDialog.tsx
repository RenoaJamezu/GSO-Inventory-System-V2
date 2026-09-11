import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2, X } from "lucide-react";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { FormField, FormInput, FormSelect } from "@/components/form";

import { Button } from "@/components/ui";

import {
  useCreateStockCardTransaction,
  useDeleteStockCardTransaction,
  useUpdateStockCardTransaction,
} from "../hooks/useStockCardTransactions";

import {
  stockCardTransactionSchema,
  type StockCardTransactionFormValues,
} from "../schemas/stockCardTransaction.schema";

import type { StockCardTransaction } from "../types";

type Props = {
  open: boolean;
  stockCardId: number;
  transaction?: StockCardTransaction | null;
  currentBalance: number;
  onClose: () => void;
};

const defaultValues: StockCardTransactionFormValues = {
  transaction_date: "",
  reference: "",
  transaction_type: "RECEIPT",
  quantity: "",
  office: "",
  days_to_consume: "",
};

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    if (error.message.toLowerCase().includes("insufficient stock")) {
      return "This transaction would result in negative stock.";
    }

    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export default function StockCardTransactionDialog({
  open,
  stockCardId,
  transaction,
  currentBalance,
  onClose,
}: Props) {
  const createTransaction = useCreateStockCardTransaction();

  const updateTransaction = useUpdateStockCardTransaction();

  const deleteTransaction = useDeleteStockCardTransaction();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors },
  } = useForm<StockCardTransactionFormValues>({
    resolver: zodResolver(stockCardTransactionSchema),
    defaultValues,
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const transactionType = watch("transaction_type");

  const availableStock =
    transaction?.transaction_type === "ISSUE"
      ? currentBalance + transaction.quantity
      : currentBalance;

  useEffect(() => {
    if (!open) return;

    setSubmitError(null);

    if (transaction) {
      reset({
        transaction_date: transaction.transaction_date,

        reference: transaction.reference ?? "",

        transaction_type: transaction.transaction_type,

        quantity: String(transaction.quantity),

        office: transaction.office ?? "",

        days_to_consume:
          transaction.days_to_consume !== null
            ? String(transaction.days_to_consume)
            : "",
      });

      return;
    }

    reset(defaultValues);
  }, [open, transaction, reset]);

  const isPending =
    createTransaction.isPending ||
    updateTransaction.isPending ||
    deleteTransaction.isPending;

  async function onSubmit(values: StockCardTransactionFormValues) {
    setSubmitError(null);

    const quantity = Number(values.quantity);

    if (values.transaction_type === "ISSUE" && quantity > availableStock) {
      setError("quantity", {
        type: "manual",
        message: `Only ${availableStock} unit(s) are available.`,
      });

      return;
    }

    const input = {
      stock_card_id: stockCardId,

      transaction_date: values.transaction_date,

      reference: values.reference.trim() || null,

      transaction_type: values.transaction_type,

      quantity,

      office: values.transaction_type === "ISSUE" ? values.office.trim() : null,

      days_to_consume:
        values.days_to_consume.trim() === ""
          ? null
          : Number(values.days_to_consume),
    };

    try {
      if (transaction) {
        await updateTransaction.mutateAsync({
          id: transaction.id,
          input,
        });
      } else {
        await createTransaction.mutateAsync(input);
      }

      onClose();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  }

  async function handleDelete() {
    if (!transaction) return;

    const confirmed = window.confirm("Delete this transaction?");

    if (!confirmed) return;

    setSubmitError(null);

    try {
      await deleteTransaction.mutateAsync({
        id: transaction.id,
        stockCardId,
      });

      onClose();
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader
        title={transaction ? "Edit Transaction" : "Add Transaction"}
      >
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className="rounded-md p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>
      </DialogHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="space-y-4">
            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-sm text-red-700">{submitError}</p>
              </div>
            )}

            <FormField label="Date" required>
              <FormInput {...register("transaction_date")} type="date" />

              {errors.transaction_date?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.transaction_date.message}
                </p>
              )}
            </FormField>

            <FormField label="Reference">
              <FormInput
                {...register("reference")}
                placeholder="e.g. PO-001 or RIS-001"
              />

              {errors.reference?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.reference.message}
                </p>
              )}
            </FormField>

            <FormField label="Transaction Type" required>
              <FormSelect {...register("transaction_type")}>
                <option value="RECEIPT">Receipt</option>

                <option value="ISSUE">Issue</option>
              </FormSelect>

              {errors.transaction_type?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.transaction_type.message}
                </p>
              )}
            </FormField>

            <FormField label="Quantity" required>
              <FormInput
                {...register("quantity")}
                type="number"
                min="0.01"
                step="any"
                placeholder="0"
              />

              {errors.quantity?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.quantity.message}
                </p>
              )}
            </FormField>

            {transactionType === "ISSUE" && (
              <>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-medium text-gray-500">
                    Available Stock
                  </p>

                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {availableStock}
                  </p>
                </div>

                <FormField label="Office" required>
                  <FormInput
                    {...register("office")}
                    placeholder="e.g. Mayor's Office"
                  />

                  {errors.office?.message && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.office.message}
                    </p>
                  )}
                </FormField>
              </>
            )}

            <FormField label="No. of Days to Consume">
              <FormInput
                {...register("days_to_consume")}
                type="number"
                min="0"
                step="1"
                placeholder="Optional"
              />

              {errors.days_to_consume?.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.days_to_consume.message}
                </p>
              )}
            </FormField>
          </div>
        </DialogBody>

        <DialogFooter>
          <div className="flex w-full items-center justify-between gap-3">
            <div>
              {transaction && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4" />

                  {deleteTransaction.isPending ? "Deleting..." : "Delete"}
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isPending}>
                {createTransaction.isPending || updateTransaction.isPending
                  ? "Saving..."
                  : transaction
                    ? "Save Changes"
                    : "Add Transaction"}
              </Button>
            </div>
          </div>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
