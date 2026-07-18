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

import {
  useCreateInventoryAccount,
  useUpdateInventoryAccount,
} from "../hooks/useInventoryAccounts";

import {
  inventoryAccountSchema,
  type InventoryAccountForm,
} from "../schemas/inventoryAccount.schema";

import { normalizeFieldKey } from "@/lib/utils/normalizeFieldKey";
import { Boxes, FileText, Package } from "lucide-react";
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
    formState: { errors },
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

      handleClose();
    } catch (error) {
      console.error("Failed saving inventory account", error);
    }
  }

  return (
    <Dialog open={open} maxWidth="lg" onClose={onClose}>
      <DialogHeader title={isEditing ? "Edit Account" : "Add Account"} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogBody>
          <div className="space-y-4">
            <FormField label="Account Title" required>
              <FormInput {...register("account_title")} />

              {errors.account_title && (
                <p className="text-sm text-red-500">
                  {errors.account_title.message}
                </p>
              )}
            </FormField>

            <FormField label="Book Value">
              <FormInput
                type="number"
                {...register("book_value", {
                  valueAsNumber: true,
                })}
              />
            </FormField>

            <FormField label="Variance">
              <FormInput
                type="number"
                {...register("variance", {
                  valueAsNumber: true,
                })}
              />
            </FormField>
          </div>

          <div className="space-y-3 pt-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Inventory Visibility
            </h3>

            <div className="grid grid-cols-3 space-x-3">
              <Controller
                control={control}
                name="is_par_visible"
                render={({ field }) => (
                  <FormCheckbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    icon={<FileText size={18} />}
                    label="Visible in PAR"
                    description="Officer-accountable property."
                    colorTheme="blue"
                  />
                )}
              />

              <Controller
                control={control}
                name="is_high_cost_visible"
                render={({ field }) => (
                  <FormCheckbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    icon={<Package size={18} />}
                    label="Visible in High Cost"
                    description="Above capitalization threshold."
                    colorTheme="orange"
                  />
                )}
              />

              <Controller
                control={control}
                name="is_low_cost_visible"
                render={({ field }) => (
                  <FormCheckbox
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    icon={<Boxes size={18} />}
                    label="Visible in Low Cost"
                    description="Below capitalization threshold."
                    colorTheme="purple"
                  />
                )}
              />
            </div>
          </div>
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="danger" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditing ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}
