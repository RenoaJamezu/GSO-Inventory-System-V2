import * as XLSX from "xlsx";

export async function loadTemplate(templateUrl: string) {
  const response = await fetch(templateUrl);

  if (!response.ok) {
    throw new Error(`Failed to load template: ${templateUrl}`);
  }

  const arrayBuffer = await response.arrayBuffer();

  return XLSX.read(arrayBuffer, {
    type: "array",
  });
}
