import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { FormCheckbox, FormField, FormInput } from "@/components/form";

import { Button } from "@/components/ui";

import { Boxes, FileText, Package } from "lucide-react";

import {
  useCreateInventoryAccount,
  useUpdateInventoryAccount,
} from "../hooks/useInventoryAccounts";

import {
  inventoryAccountSchema,
  type InventoryAccountForm,
} from "../schemas/inventoryAccount.schema";

import { normalizeFieldKey } from "@/lib/utils/normalizeFieldKey";

import type { InventoryAccount, WorkspaceType } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  account?: InventoryAccount | null;
  workspace: WorkspaceType;
};

export default function InventoryAccountDialog({
  open,
  onClose,
  account,
  workspace,
}: Props) {
  const createMutation = useCreateInventoryAccount();
  const updateMutation = useUpdateInventoryAccount();

  const isEditing = Boolean(account);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryAccountForm>({
    resolver: zodResolver(inventoryAccountSchema),

    defaultValues: {
      account_title: "",
      book_value: 0,
      variance: 0,
      is_par_visible: workspace === "PAR",
      is_high_cost_visible: workspace === "HIGH_COST",
      is_low_cost_visible: workspace === "LOW_COST",
    },
  });

  const loading =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) return;

    if (account) {
      reset({
        account_title: account.account_title,
        book_value: account.book_value,
        variance: account.variance,

        is_par_visible: account.is_par_visible,
        is_high_cost_visible: account.is_high_cost_visible,
        is_low_cost_visible: account.is_low_cost_visible,
      });

      return;
    }

    reset({
      account_title: "",
      book_value: 0,
      variance: 0,

      is_par_visible: workspace === "PAR",
      is_high_cost_visible: workspace === "HIGH_COST",
      is_low_cost_visible: workspace === "LOW_COST",
    });
  }, [workspace, account, open, reset]);

  function handleClose() {
    if (loading) return;

    reset({
      account_title: "",
      book_value: 0,
      variance: 0,

      is_par_visible: workspace === "PAR",
      is_high_cost_visible: workspace === "HIGH_COST",
      is_low_cost_visible: workspace === "LOW_COST",
    });

    onClose();
  }

  async function onSubmit(values: InventoryAccountForm) {
    try {
      const payload = {
        ...values,
        slug: normalizeFieldKey(values.account_title),
      };

      if (isEditing && account) {
        await updateMutation.mutateAsync({
          id: account.id,
          values: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      /*
       * Don't call handleClose here because
       * loading may still be true while the
       * mutation promise is resolving.
       */
      reset();
      onClose();
    } catch (error) {
      console.error("Failed saving inventory account", error);
    }
  }

  return (
    <Dialog
      open={open}
      maxWidth="lg"
      onClose={loading ? undefined : handleClose}
    >
      <DialogHeader title={isEditing ? "Edit Account" : "Add Account"}>
        <p className="mt-1 text-sm font-normal text-slate-500 dark:text-slate-400">
          {isEditing
            ? "Update the account information and inventory visibility."
            : "Create an account title for use in the inventory system."}
        </p>
      </DialogHeader>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
      >
        <DialogBody>
          <div className="space-y-6">
            {/* Account information */}
            <section className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Account Information
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Enter the financial and identifying information for this
                  account.
                </p>
              </div>

              <FormField label="Account Title" required>
                <FormInput
                  {...register("account_title")}
                  placeholder="Enter account title"
                />

                {errors.account_title && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.account_title.message}
                  </p>
                )}
              </FormField>

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Book Value">
                  <FormInput
                    type="number"
                    min="0"
                    step="0.01"
                    {...register("book_value", {
                      valueAsNumber: true,
                    })}
                  />

                  {errors.book_value && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.book_value.message}
                    </p>
                  )}
                </FormField>

                <FormField label="Variance">
                  <FormInput
                    type="number"
                    step="0.01"
                    {...register("variance", {
                      valueAsNumber: true,
                    })}
                  />

                  {errors.variance && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.variance.message}
                    </p>
                  )}
                </FormField>
              </div>
            </section>

            {/* Inventory visibility */}
            <section className="space-y-4 border-t border-slate-200 pt-6 dark:border-slate-800">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Inventory Visibility
                </h3>

                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Select the workspaces where this account should be available.
                </p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <Controller
                  control={control}
                  name="is_par_visible"
                  render={({ field }) => (
                    <FormCheckbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      icon={<FileText size={18} />}
                      label="PAR"
                      description="Officer-accountable property."
                      colorTheme="emerald"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="is_high_cost_visible"
                  render={({ field }) => (
                    <FormCheckbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      icon={<Package size={18} />}
                      label="High Cost"
                      description="Above capitalization threshold."
                      colorTheme="gray"
                    />
                  )}
                />

                <Controller
                  control={control}
                  name="is_low_cost_visible"
                  render={({ field }) => (
                    <FormCheckbox
                      checked={field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
                      icon={<Boxes size={18} />}
                      label="Low Cost"
                      description="Below capitalization threshold."
                      colorTheme="gray"
                    />
                  )}
                />
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
            {isEditing ? "Save Changes" : "Create Account"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
