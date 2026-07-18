import QRCode from "react-qr-code";

import { getTheme } from "../constants";

type Props = {
  qrUuid: string;
  amount?: number;
};

export default function InventoryRecordQrCard({ qrUuid, amount }: Props) {
  const qrUrl = `${window.location.origin}/public/${qrUuid}`;

  const theme = getTheme(Number(amount));

  return (
    <div
      className="h-[5.55cm] w-[8cm] border-[3px] bg-white shadow print:shadow-none print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact] font-times"
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

        <p className="text-center text-[9px]">GENERAL SERVICES OFFICE</p>
      </div>

      {/* Divider */}
      <div
        className="h-3 print:[-webkit-print-color-adjust:exact] print:[print-color-adjust:exact]"
        style={{
          backgroundColor: theme.color,
        }}
      />

      {/* Body */}
      <div className="grid grid-cols-2 gap-2 p-1 px-3">
        <div className="mb-3 flex flex-col justify-center gap-4">
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

        <div className="flex flex-col items-center justify-end">
          <QRCode value={qrUrl} size={80} />
          <p className="text-[6px] font-medium">Scan to view</p>
        </div>
      </div>

      {/* Divider */}

      <div className="flex-1 px-0.5 leading-tight text-[6px]">
        <p className="font-medium">Note: PLEASE DO NOT REMOVE</p>

        <p className="font-medium">
          Unauthorized removal or tampering will be subject to disciplinary
          action
        </p>
      </div>
    </div>
  );
}
