import { Dialog, DialogBody, DialogFooter, DialogHeader } from ".";

type ConfirmDialogProps = {
  open: boolean;
  title?: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title = "Confirm",
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} maxWidth="sm">
      <DialogHeader title={title} />

      <DialogBody>
        <p className="text-sm text-gray-600">{description}</p>
      </DialogBody>

      <DialogFooter>
        <button
          onClick={onCancel}
          disabled={loading}
          className="rounded border px-4 py-2 disabled:opacity-50"
        >
          {cancelText}
        </button>

        <button
          onClick={onConfirm}
          disabled={loading}
          className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? "Deleting..." : confirmText}
        </button>
      </DialogFooter>
    </Dialog>
  );
}
