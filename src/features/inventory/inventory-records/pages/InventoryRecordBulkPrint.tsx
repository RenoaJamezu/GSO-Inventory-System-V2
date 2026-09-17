import type { InventoryType } from "../types";

import InventoryRecordPrintLayout from "../components/InventoryRecordPrintLayout";
import InventoryRecordQrCard from "../components/InventoryRecordQrCard";

type PrintableRecord = {
  qrUuid: string;
  inventoryType: InventoryType;
};

type Props = {
  records: PrintableRecord[];
};

const ITEMS_PER_PAGE = 10;

export default function InventoryRecordBulkPrint({ records }: Props) {
  const pages: PrintableRecord[][] = [];

  for (let index = 0; index < records.length; index += ITEMS_PER_PAGE) {
    pages.push(records.slice(index, index + ITEMS_PER_PAGE));
  }

  return (
    <>
      {pages.map((page, pageIndex) => (
        <div
          key={pageIndex}
          className={
            pageIndex < pages.length - 1
              ? "break-after-page print:break-after-page"
              : undefined
          }
        >
          <InventoryRecordPrintLayout>
            {page.map((record) => (
              <InventoryRecordQrCard
                key={record.qrUuid}
                qrUuid={record.qrUuid}
                inventoryType={record.inventoryType}
              />
            ))}
          </InventoryRecordPrintLayout>
        </div>
      ))}
    </>
  );
}
