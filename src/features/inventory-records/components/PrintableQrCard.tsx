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
      color: "#15803d",
    };
  }

  if (amount >= 15000) {
    return {
      color: "#eab308",
    };
  }

  return {
    color: "#734f96",
  };
}

export default function PrintableQrCard({ record }: Props) {
  const theme = getTheme(Number(record.amount));

  const qrUrl = `${window.location.origin}/public/${record.qr_uuid}`;

  return (
    <div
      className="w-[8cm] border-[3px] bg-white shadow print:shadow-none print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]"
      style={{
        borderColor: theme.color,
      }}
    >
      {/* Header */}
      <div className="px-2 pt-2">
        <div className="flex items-center">
          <img
            src="/images/sibagat-logo.png"
            alt="Municipality Logo"
            className="h-12 w-12 object-contain"
          />

          <div className="flex-1 text-center leading-tight">
            <p className="text-[9px] font-medium">
              Republic of the Philippines
            </p>

            <p className="text-[9px] font-medium">Province of Agusan del Sur</p>

            <h1 className="text-[12px] font-bold">MUNICIPALITY OF SIBAGAT</h1>
          </div>
          <img
            src="/images/gso-logo.png"
            alt="GSO Logo"
            className="h-12 w-12 object-contain"
          />
        </div>
        <p className="text-[9px] text-center">GENERAL SERVICES OFFICE</p>
      </div>

      {/* Divider */}
      <div
        className="h-3 print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]"
        style={{
          backgroundColor: theme.color,
        }}
      />

      {/* Body */}
      <div className="grid grid-cols-2 gap-2 p-2">
        {/* Signatures */}
        <div className="flex flex-col justify-center gap-4 mb-3">
          <div className="text-center">
            <img
              src="/images/mayor-signature.png"
              alt=""
              className="mx-auto h-5 scale-150"
            />

            <h2 className="text-[9px] font-bold">THELMA G. LAMANILAO, MD.</h2>

            <p className="text-[7px] leading-0.5">Municipal Mayor</p>
          </div>

          <div className="text-center">
            <img
              src="/images/supply-signature.png"
              alt=""
              className="mx-auto h-5 scale-175"
            />

            <h2 className="text-[9px] font-bold">MARCEDITO E. POLESTICO</h2>

            <p className="text-[7px] leading-0.5">Supply Officer III</p>
          </div>
        </div>

        {/* QR */}
        <div className="flex items-center justify-center">
          <QRCode value={qrUrl} size={80} />
        </div>
      </div>
    </div>
  );
}
