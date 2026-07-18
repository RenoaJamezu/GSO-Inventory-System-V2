import InventoryRecordPrintLayout from "../components/InventoryRecordPrintLayout";
import InventoryRecordQrCard from "../components/InventoryRecordQrCard";

type PrintableRecord = {
  qrUuid: string;
  amount?: number;
};

type Props = {
  records: PrintableRecord[];
};

const ITEMS_PER_PAGE = 8;

export default function InventoryRecordBulkPrint({ records }: Props) {
  const pages: PrintableRecord[][] = [];

  for (let i = 0; i < records.length; i += ITEMS_PER_PAGE) {
    pages.push(records.slice(i, i + ITEMS_PER_PAGE));
  }

  return (
    <>
      {pages.map((page, pageIndex) => (
        <div
          key={pageIndex}
          className={
            pageIndex < pages.length - 1
              ? "break-after-page print:break-after-page"
              : ""
          }
        >
          <InventoryRecordPrintLayout>
            {page.map((record) => (
              <InventoryRecordQrCard
                key={record.qrUuid}
                qrUuid={record.qrUuid}
                amount={record.amount}
              />
            ))}
          </InventoryRecordPrintLayout>
        </div>
      ))}
    </>
  );
}
