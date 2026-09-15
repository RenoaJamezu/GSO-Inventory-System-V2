import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { AlertTriangle, Trash2 } from "lucide-react";

import {
  ConfirmDialog,
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
import { PERMISSIONS, usePermissions } from "@/features/auth";

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

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  /*
   * While editing an existing ISSUE,
   * restore its original quantity to
   * available stock before validating
   * the new value.
   */
  const availableStock =
    transaction?.transaction_type === "ISSUE"
      ? currentBalance + transaction.quantity
      : currentBalance;

  const isPending =
    createTransaction.isPending ||
    updateTransaction.isPending ||
    deleteTransaction.isPending;

  const { can } = usePermissions();

  const canDelete = can(PERMISSIONS.STOCK_CARD_DELETE);

  useEffect(() => {
    if (!open) return;

    setSubmitError(null);
    setDeleteDialogOpen(false);

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

  function handleClose() {
    if (isPending) return;

    setDeleteDialogOpen(false);
    onClose();
  }

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

  function requestDelete() {
    if (!canDelete) return;
    if (!transaction) return;

    setSubmitError(null);
    setDeleteDialogOpen(true);
  }

  function closeDeleteDialog() {
    if (deleteTransaction.isPending) {
      return;
    }

    setDeleteDialogOpen(false);
  }

  async function confirmDelete() {
    if (!canDelete) return;
    if (!transaction) return;

    setSubmitError(null);

    try {
      await deleteTransaction.mutateAsync({
        id: transaction.id,
        stockCardId,
      });

      setDeleteDialogOpen(false);
      onClose();
    } catch (error) {
      setDeleteDialogOpen(false);
      setSubmitError(getErrorMessage(error));
    }
  }

  return (
    <>
      <Dialog
        open={open}
        maxWidth="lg"
        onClose={isPending ? undefined : handleClose}
      >
        <DialogHeader
          title={transaction ? "Edit Transaction" : "Add Transaction"}
        >
          <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
            {transaction
              ? "Update this stock receipt or issuance."
              : "Record a receipt or issuance for this stock item."}
          </p>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex min-h-0 flex-1 flex-col overflow-hidden"
        >
          <DialogBody>
            <div className="space-y-6">
              {submitError && (
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
                    className="mt-0.5 shrink-0 text-red-600 dark:text-red-400"
                  />

                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                      Transaction could not be saved
                    </p>

                    <p className="mt-0.5 text-sm text-red-600 dark:text-red-400">
                      {submitError}
                    </p>
                  </div>
                </div>
              )}

              <section className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Transaction Information
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Enter the date, reference and transaction type.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Date" required>
                    <FormInput {...register("transaction_date")} type="date" />

                    {errors.transaction_date?.message && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
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
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                        {errors.reference.message}
                      </p>
                    )}
                  </FormField>
                </div>

                <FormField label="Transaction Type" required>
                  <FormSelect {...register("transaction_type")}>
                    <option value="RECEIPT">Receipt</option>

                    <option value="ISSUE">Issue</option>
                  </FormSelect>

                  {errors.transaction_type?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.transaction_type.message}
                    </p>
                  )}
                </FormField>
              </section>

              <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Quantity Details
                  </h3>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    Enter the quantity and any applicable issuance details.
                  </p>
                </div>

                <FormField label="Quantity" required>
                  <FormInput
                    {...register("quantity")}
                    type="number"
                    min="0.01"
                    step="any"
                    placeholder="0"
                  />

                  {errors.quantity?.message && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.quantity.message}
                    </p>
                  )}
                </FormField>

                {transactionType === "ISSUE" && (
                  <>
                    <div
                      className="
                        rounded-md
                        border
                        border-slate-200
                        bg-slate-50
                        px-4 py-3

                        dark:border-slate-800
                        dark:bg-slate-950/40
                      "
                    >
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Available Stock
                      </p>

                      <p className="mt-1 text-xl font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                        {availableStock}
                      </p>
                    </div>

                    <FormField label="Office" required>
                      <FormInput
                        {...register("office")}
                        placeholder="e.g. Mayor's Office"
                      />

                      {errors.office?.message && (
                        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
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
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.days_to_consume.message}
                    </p>
                  )}
                </FormField>
              </section>
            </div>
          </DialogBody>

          <DialogFooter>
            <div className="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                {transaction && canDelete && (
                  <Button
                    type="button"
                    variant="danger"
                    onClick={requestDelete}
                    disabled={isPending}
                    className="flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  loading={
                    createTransaction.isPending || updateTransaction.isPending
                  }
                  disabled={deleteTransaction.isPending}
                >
                  {transaction ? "Save Changes" : "Add Transaction"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </form>
      </Dialog>

      {canDelete && (
        <ConfirmDialog
          open={deleteDialogOpen}
          title="Delete Transaction"
          description="Are you sure you want to delete this stock transaction? The stock card balance will be recalculated from the remaining transactions."
          confirmText="Delete Transaction"
          loading={deleteTransaction.isPending}
          loadingText="Deleting..."
          onClose={closeDeleteDialog}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
}
