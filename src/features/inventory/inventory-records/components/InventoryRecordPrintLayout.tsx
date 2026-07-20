type Props = {
  children: React.ReactNode;
};

export default function InventoryRecordPrintLayout({ children }: Props) {
  return (
    <>
      <style>
        {`
          @page {
            size: A4 portrait;
            margin: 0;
          }

          @media print {
            html,
            body {
              margin: 0;
              padding: 0;
              background: white;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
          }
        `}
      </style>

      <div
        className="
          box-border
          w-[8.27in]
          h-[11.69in]
          bg-white

          grid
          grid-cols-2
          grid-rows-5

          px-[0.2in]
          py-[0.2in]
        "
      >
        {children}
      </div>
    </>
  );
}