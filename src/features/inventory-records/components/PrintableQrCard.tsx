import QRCode from "react-qr-code";

type Column = {
  field_key: string;
  label: string;
  data_type: string;
};

type PublicInventoryRecord = {
  qr_uuid: string;
  account_title: string;
  group_name: string | null;
  data: Record<string, unknown>;
  columns: Column[];
  amount: number;
};

type Props = {
  record: PublicInventoryRecord;
};

function getTheme(amount: number) {
  if (amount >= 50000) {
    return {
      border: "border-green-700",
      divider: "bg-green-700",
      frame: "border-green-700",
    };
  }

  if (amount >= 15000) {
    return {
      border: "border-yellow-500",
      divider: "bg-yellow-500",
      frame: "border-yellow-500",
    };
  }

  return {
    border: "border-gray-700",
    divider: "bg-gray-700",
    frame: "border-gray-700",
  };
}

export default function PrintableQrCard({ record }: Props) {
  const theme = getTheme(Number(record.amount));

  const qrUrl = `${window.location.origin}/public/${record.qr_uuid}`;

  return (
    <div className={`mx-auto w-190 border-4 bg-white ${theme.border}`}>
      {/* Header */}
      <div className="flex items-center flex-col">
        <div className="flex items-center pt-6 px-4">
          <img
            src="/public/sibagat-logo.png"
            alt="Municipality Logo"
            className="h-50 w-50 object-contain"
          />

          <div className="flex-1 text-center leading-tight">
            <p className="text-3xl font-semibold">
              Republic of the Philippines
            </p>

            <p className="text-3xl font-semibold">Province of Agusan del Sur</p>

            <h1 className="mt-2 text-4xl font-extrabold">
              MUNICIPALITY OF SIBAGAT
            </h1>
          </div>
        </div>
        <p className="text-3xl">GENERAL SERVICES OFFICE</p>
      </div>

      {/* Colored Divider */}
      <div className={`h-12 ${theme.divider}`} />

      {/* Body */}
      <div className="grid grid-cols-2 gap-8 p-8">
        {/* Signatures */}
        <div className="flex flex-col justify-end space-y-6">
          <div className="text-center">
            <img
              src="/public/mayor-signature.png"
              alt=""
              className="mx-auto h-16"
            />

            <h2 className="text-2xl font-bold">THELMA G. LAMANILAO, MD.</h2>

            <p className="text-xl">Municipal Mayor</p>
          </div>

          <div className="text-center">
            <img
              src="/public/supply-signature.png"
              alt=""
              className="mx-auto h-16 scale-150"
            />

            <h2 className="text-2xl font-bold">MARCEDITO E. POLESTICO</h2>

            <p className="text-xl">Supply Officer-III</p>
          </div>
        </div>

        {/* QR */}
        <div className="flex items-center justify-center">
          <QRCode value={qrUrl} size={250} />
        </div>
      </div>
    </div>
  );
}
