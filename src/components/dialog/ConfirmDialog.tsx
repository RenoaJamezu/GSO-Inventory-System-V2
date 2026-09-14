import { Button } from "@/components/ui";

import { Dialog, DialogBody, DialogFooter, DialogHeader } from ".";

type ConfirmDialogProps = {
  open: boolean;

  title?: string;
  description: string;

  confirmText?: string;
  cancelText?: string;

  loading?: boolean;
  loadingText?: string;

  onConfirm: () => void;
  onClose: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Confirm",
  description,

  confirmText = "Delete",
  cancelText = "Cancel",

  loading = false,
  loadingText = "Processing...",

  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} maxWidth="md" onClose={loading ? undefined : onClose}>
      <DialogHeader title={title} />

      <DialogBody>
        <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
          {description}
        </p>
      </DialogBody>

      <DialogFooter>
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          disabled={loading}
        >
          {cancelText}
        </Button>

        <Button
          type="button"
          variant="danger"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? loadingText : confirmText}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
