import type { ReactNode } from "react";

import { Button, type ButtonVariant } from "@/components/ui";

import { Dialog, DialogBody, DialogFooter, DialogHeader } from ".";

export type ConfirmDialogProps = {
  open: boolean;

  title?: ReactNode;
  description: ReactNode;

  confirmText?: ReactNode;
  cancelText?: ReactNode;

  confirmVariant?: ButtonVariant;

  loading?: boolean;
  loadingText?: ReactNode;

  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDialog({
  open,

  title = "Confirm",
  description,

  confirmText = "Delete",
  cancelText = "Cancel",
  confirmVariant = "danger",

  loading = false,
  loadingText = "Processing...",

  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} maxWidth="md" onClose={loading ? undefined : onClose}>
      <DialogHeader title={title} />

      <DialogBody>
        <div
          className="
            whitespace-pre-line
            text-sm leading-6
            text-slate-600
            dark:text-slate-400
          "
        >
          {description}
        </div>
      </DialogBody>

      <DialogFooter>
        <Button variant="secondary" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>

        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          loading={loading}
          loadingText={
            typeof loadingText === "string" ? loadingText : undefined
          }
        >
          {loading && typeof loadingText !== "string"
            ? loadingText
            : confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
