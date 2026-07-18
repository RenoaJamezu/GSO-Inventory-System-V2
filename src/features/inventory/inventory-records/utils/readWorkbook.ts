import * as XLSX from "xlsx";

export async function readWorkbook(file: File) {
  const buffer = await file.arrayBuffer();

  return XLSX.read(buffer, {
    type: "array",
  });
}
