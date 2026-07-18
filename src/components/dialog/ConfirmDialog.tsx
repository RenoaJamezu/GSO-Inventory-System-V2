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
    <Dialog open={open} maxWidth="md" onClose={onClose}>
      <DialogHeader title={title} />

      <DialogBody>
        <p className="text-sm text-gray-600">{description}</p>
      </DialogBody>

      <DialogFooter>
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          {cancelText}
        </button>

        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? loadingText : confirmText}
        </button>
      </DialogFooter>
    </Dialog>
  );
}
