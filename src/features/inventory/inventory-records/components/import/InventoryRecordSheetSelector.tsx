import * as XLSX from "xlsx";

import { FormField, FormSelect } from "@/components/form";

type Props = {
  workbook: XLSX.WorkBook | null;
  value: string;
  onChange: (sheetName: string) => void;
};

export default function InventoryRecordSheetSelector({
  workbook,
  value,
  onChange,
}: Props) {
  if (!workbook) return null;

  return (
    <FormField label="Worksheet">
      <FormSelect
        value={value}
        options={workbook.SheetNames.map((sheetName) => ({
          value: sheetName,
          label: sheetName,
        }))}
        onChange={onChange}
      />

      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Select the worksheet containing the inventory records.
      </p>
    </FormField>
  );
}
