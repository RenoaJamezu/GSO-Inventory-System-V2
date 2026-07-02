import { useParams } from "react-router-dom";
import { useInventoryRecordByUuid } from "../hooks/useInventoryRecords";
import { QRCode } from "react-qr-code";

export default function InventoryRecordQrCodePage() {
  const { uuid } = useParams();

  const { data: record, isLoading } = useInventoryRecordByUuid(uuid!);

  if (isLoading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!record) {
    return <div className="p-6">Record not found</div>;
  }

  const formatKey = (key: string) =>
    key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const qrUrl = `${window.location.origin}/public/${record.qr_uuid}`;

  return (
    <div className="mx-auto max-w-xl p-6 space-y-6">
      <h1 className="text-xl font-bold">Inventory QR:</h1>

      <div className="flex flex-col items-center justify-center space-y-2">
        <QRCode value={qrUrl} size={180} />
        <p>
          <b>UUID:</b> {record.qr_uuid}
        </p>
      </div>

      <div className="border rounded-2xl p-4 space-y-2">
        {Object.entries(record.data ?? {}).map(([key, value]) => (
          <p key={key}>
            <b>{formatKey(key)}:</b> {String(value)}
          </p>
        ))}
      </div>
    </div>
  );
}
