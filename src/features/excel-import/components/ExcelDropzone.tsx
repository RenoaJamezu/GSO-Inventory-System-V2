type Props = {
  file: File | null;
  onFileSelect: (file: File) => void;
};

export default function ExcelDropzone({ file, onFileSelect }: Props) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];

    if (!selected) return;

    onFileSelect(selected);
  }

  return (
    <label className="flex h-40 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-gray-300 transition hover:border-blue-500 hover:bg-blue-50">
      <input hidden type="file" accept=".xlsx,.xls" onChange={handleChange} />

      <div className="text-center">
        <p className="text-lg font-medium">
          {file ? file.name : "Choose Excel File"}
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Supported formats: .xlsx, .xls
        </p>

        {!file && (
          <p className="mt-4 text-xs text-gray-400">
            Click to browse your computer
          </p>
        )}
      </div>
    </label>
  );
}
