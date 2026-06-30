import { useEffect, useState } from "react";

import {
  useCreateInventoryAccount,
  useUpdateInventoryAccount,
} from "../hooks/useInventoryAccounts";

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

  const isEditing = !!account;

  const [title, setTitle] = useState("");
  const [bookValue, setBookValue] = useState(0);
  const [variance, setVariance] = useState(0);

  useEffect(() => {
    if (account) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(account.account_title);
      setBookValue(account.book_value);
      setVariance(account.variance);
    } else {
      setTitle("");
      setBookValue(0);
      setVariance(0);
    }
  }, [account]);

  if (!open) return null;

  async function handleSubmit() {
    const values = {
      account_title: title,
      slug: slugify(title),
      book_value: bookValue,
      variance,
    };

    if (isEditing) {
      await updateMutation.mutateAsync({
        id: account.id,
        values,
      });
    } else {
      await createMutation.mutateAsync(values);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded bg-white p-6">
        <h2 className="mb-4 text-xl font-bold">
          {isEditing ? "Edit Account" : "Add Account"}
        </h2>

        <div className="space-y-4">
          <label>Account Title</label>
          <input
            className="w-full rounded border p-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Book Value</label>
          <input
            type="number"
            className="w-full rounded border p-2"
            value={bookValue}
            onChange={(e) => setBookValue(Number(e.target.value))}
          />

          <label>Variance</label>
          <input
            type="number"
            className="w-full rounded border p-2"
            value={variance}
            onChange={(e) => setVariance(Number(e.target.value))}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="rounded border px-4 py-2">
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
