import { zodResolver } from "@hookform/resolvers/zod";
import { Boxes, FileText, Package } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";
import {
  FormCheckbox,
  FormField,
  FormInput,
  FormNumberInput,
} from "@/components/form";
import { Button } from "@/components/ui";
import { normalizeFieldKey } from "@/lib/utils/normalizeFieldKey";

import {
  useCreateInventoryAccount,
  useUpdateInventoryAccount,
} from "../hooks/useInventoryAccounts";
import {
  inventoryAccountSchema,
  type InventoryAccountForm,
} from "../schemas/inventoryAccount.schema";
import type { InventoryAccount, WorkspaceType } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  account?: InventoryAccount | null;
  workspace: WorkspaceType;
};

function getDefaultValues(workspace: WorkspaceType): InventoryAccountForm {
  return {
    account_title: "",
    book_value: 0,
    variance: 0,
    is_par_visible: workspace === "PAR",
    is_high_cost_visible: workspace === "HIGH_COST",
    is_low_cost_visible: workspace === "LOW_COST",
  };
}

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
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InventoryAccountForm>({
    resolver: zodResolver(inventoryAccountSchema),
    defaultValues: getDefaultValues(workspace),
  });

  const loading =
    isSubmitting || createMutation.isPending || updateMutation.isPending;

  useEffect(() => {
    if (!open) {
      return;
    }

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

    reset(getDefaultValues(workspace));
  }, [workspace, account, open, reset]);

  function handleClose() {
    if (loading) {
      return;
    }

    reset(getDefaultValues(workspace));
    onClose();
  }

  async function onSubmit(values: InventoryAccountForm) {
    try {
      const payload = {
        ...values,
        slug: normalizeFieldKey(values.account_title),
      };

      if (account) {
        await updateMutation.mutateAsync({
          id: account.id,
          values: payload,
        });
      } else {
        await createMutation.mutateAsync(payload);
      }

      reset(getDefaultValues(workspace));
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

              <Controller
                control={control}
                name="account_title"
                render={({ field }) => (
                  <FormField
                    label="Account Title"
                    required
                    error={errors.account_title?.message}
                  >
                    <FormInput
                      name={field.name}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      placeholder="Enter account title"
                    />
                  </FormField>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  control={control}
                  name="book_value"
                  render={({ field }) => (
                    <FormField
                      label="Book Value"
                      error={errors.book_value?.message}
                    >
                      <FormNumberInput
                        value={field.value}
                        onValueChange={field.onChange}
                        min={0}
                        maximumFractionDigits={2}
                      />
                    </FormField>
                  )}
                />

                <Controller
                  control={control}
                  name="variance"
                  render={({ field }) => (
                    <FormField
                      label="Variance"
                      error={errors.variance?.message}
                    >
                      <FormNumberInput
                        value={field.value}
                        onValueChange={field.onChange}
                        maximumFractionDigits={2}
                      />
                    </FormField>
                  )}
                />
              </div>
            </section>

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
