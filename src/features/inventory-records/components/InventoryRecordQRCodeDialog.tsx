import QRCode from "react-qr-code";

import {
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@/components/dialog";

import type { InventoryRecord } from "../types";

type Props = {
  open: boolean;
  record: InventoryRecord | null;
  onClose: () => void;
};

export default function InventoryRecordQrCodeDialog({
  open,
  record,
  onClose,
}: Props) {
  if (!open || !record) return null;

  const qrUrl = `${window.location.origin}/public/${record.qr_uuid}`;

  return (
    <Dialog open={open} maxWidth="sm">
      <DialogHeader title="Asset QR Code" />

      <DialogBody>
        <div className="flex flex-col items-center gap-6">
          <QRCode value={qrUrl} size={240} />

          <div className="w-full rounded border bg-gray-50 p-3">
            <p className="mb-1 text-xs font-semibold text-gray-500">
              Public URL
            </p>

            <p className="break-all text-sm">{qrUrl}</p>
          </div>
        </div>
      </DialogBody>

      <DialogFooter>
        <button onClick={onClose} className="rounded border px-4 py-2">
          Close
        </button>

        <button
          onClick={() => window.print()}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Print
        </button>
      </DialogFooter>
    </Dialog>
  );
}
