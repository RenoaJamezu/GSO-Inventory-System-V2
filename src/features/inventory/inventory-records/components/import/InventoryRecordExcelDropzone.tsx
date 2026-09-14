import { FileSpreadsheet, Upload } from "lucide-react";

type Props = {
  file: File | null;
  onFileSelect: (file: File) => void;
};

export default function InventoryRecordExcelDropzone({
  file,
  onFileSelect,
}: Props) {
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];

    if (!selected) return;

    onFileSelect(selected);
  }

  return (
    <label
      className="
        flex min-h-40 cursor-pointer
        items-center justify-center
        rounded-lg border-2
        border-dashed
        border-slate-300
        bg-slate-50/50
        px-6 py-8
        transition-colors

        hover:border-emerald-500
        hover:bg-emerald-50/40

        dark:border-slate-700
        dark:bg-slate-950/30
        dark:hover:border-emerald-600
        dark:hover:bg-emerald-950/20
      "
    >
      <input hidden type="file" accept=".xlsx,.xls" onChange={handleChange} />

      <div className="text-center">
        <div
          className="
            mx-auto flex h-10 w-10
            items-center justify-center
            rounded-md
            bg-slate-100
            text-slate-600

            dark:bg-slate-800
            dark:text-slate-300
          "
        >
          {file ? <FileSpreadsheet size={20} /> : <Upload size={20} />}
        </div>

        <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">
          {file ? file.name : "Choose Excel file"}
        </p>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {file
            ? "Click to select a different file."
            : "Click to browse your computer."}
        </p>

        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          Supported formats: .xlsx and .xls
        </p>
      </div>
    </label>
  );
}
