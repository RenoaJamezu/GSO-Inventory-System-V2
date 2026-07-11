import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import { FormField, FormInput } from "@/components/form";

import { Button } from "@/components/ui";

import {
  useCreateInventoryAccount,
  useUpdateInventoryAccount,
} from "../hooks/useInventoryAccounts";

import {
  inventoryAccountSchema,
  type InventoryAccountForm,
} from "../schemas/inventoryAccount.schema";

import type { InventoryAccount } from "../types";

import { normalizeFieldKey } from "@/lib/utils/normalizeFieldKey";

type Props = {
  open: boolean;
  onClose: () => void;
  account?: InventoryAccount | null;
};

export default function InventoryAccountDialog({
  open,
  onClose,
  account,
}: Props) {
  const createMutation = useCreateInventoryAccount();

  const updateMutation = useUpdateInventoryAccount();

  const isEditing = Boolean(account);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InventoryAccountForm>({
    resolver: zodResolver(inventoryAccountSchema),

    defaultValues: {
      account_title: "",
      book_value: 0,
      variance: 0,
    },
  });

  useEffect(() => {
    if (!open) return;

    if (account) {
      reset({
        account_title: account.account_title,
        book_value: account.book_value,
        variance: account.variance,
      });

      return;
    }

    reset({
      account_title: "",
      book_value: 0,
      variance: 0,
    });
  }, [account, open, reset]);

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

      onClose();
    } catch (error) {
      console.error("Failed saving inventory account", error);
    }
  }

  return (
    <Dialog open={open} maxWidth="md">
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
        </DialogBody>

        <DialogFooter>
          <Button type="button" variant="danger" onClick={onClose}>
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
