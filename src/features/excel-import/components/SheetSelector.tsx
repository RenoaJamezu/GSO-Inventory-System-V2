import * as XLSX from "xlsx";

type Props = {
  workbook: XLSX.WorkBook | null;
  value: string;
  onChange: (sheetName: string) => void;
};

export default function SheetSelector({ workbook, value, onChange }: Props) {
  if (!workbook) return null;

  return (
    <div className="space-y-2">
      <label className="block font-medium">Worksheet</label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white p-2.5 transition focus:border-blue-500 focus:outline-none"
      >
        {workbook.SheetNames.map((sheet) => (
          <option key={sheet} value={sheet}>
            {sheet}
          </option>
        ))}
      </select>

      <p className="text-xs text-gray-500">
        Select the worksheet that contains the inventory records.
      </p>
    </div>
  );
}
