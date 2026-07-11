type Props = {
  children: React.ReactNode;
};

export default function InventoryRecordPrintLayout({ children }: Props) {
  return (
    <>
      <style>
        {`
          @page {
            size: Letter portrait;
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
          w-[8.5in]
          h-[11in]
          bg-white

          grid
          grid-cols-2
          grid-rows-4

          gap-x-6
          gap-y-4

          p-[0.55in]
        "
      >
        {children}
      </div>
    </>
  );
}
