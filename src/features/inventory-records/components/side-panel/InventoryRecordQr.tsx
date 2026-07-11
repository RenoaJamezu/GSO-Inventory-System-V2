import InventoryRecordQrCard from "../InventoryRecordQrCard";

type Props = {
  qrUuid: string;
  amount?: number;
};

export default function InventoryRecordQr({ qrUuid, amount }: Props) {
  return (
    <section className="border-b px-6 py-6">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-500">
        QR Code
      </h3>

      <div className="flex justify-center">
        <InventoryRecordQrCard qrUuid={qrUuid} amount={amount} />
      </div>

      <p className="mt-3 break-all text-center text-xs text-gray-500">
        {qrUuid}
      </p>
    </section>
  );
}
