import { useEffect } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  useCreateInventoryAccount,
  useUpdateInventoryAccount,
} from "../hooks/useInventoryAccounts";

import {
  inventoryAccountSchema,
  type InventoryAccountForm,
} from "../schemas/inventoryAccount.schema";

import type { InventoryAccount } from "../types";

type Props = {
  open: boolean;
  onClose: () => void;
  account?: InventoryAccount | null;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
}

export function InventoryAccountDialog({ open, onClose, account }: Props) {
  const createMutation = useCreateInventoryAccount();
  const updateMutation = useUpdateInventoryAccount();

  const isEditing = Boolean(account);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
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

  if (!open) return null;

  async function onSubmit(values: InventoryAccountForm) {
    const payload = {
      ...values,
      slug: slugify(values.account_title),
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
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">
          {isEditing ? "Edit Account" : "Add Account"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block">Account Title</label>

            <input
              {...register("account_title")}
              className="w-full rounded border p-2"
            />

            {errors.account_title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.account_title.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block">Book Value</label>

            <input
              type="number"
              {...register("book_value")}
              className="w-full rounded border p-2"
            />

            {errors.book_value && (
              <p className="mt-1 text-sm text-red-500">
                {errors.book_value.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block">Variance</label>

            <input
              type="number"
              {...register("variance")}
              className="w-full rounded border p-2"
            />

            {errors.variance && (
              <p className="mt-1 text-sm text-red-500">
                {errors.variance.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                isSubmitting ||
                createMutation.isPending ||
                updateMutation.isPending
              }
              className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
            >
              {isEditing ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
