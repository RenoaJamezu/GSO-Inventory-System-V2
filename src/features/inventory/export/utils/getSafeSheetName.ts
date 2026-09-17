const INVALID_SHEET_NAME_CHARACTERS = /[\\/?*[\]:]/g;

export function getSafeSheetName(name: string, usedNames: Set<string>): string {
  const cleanedName =
    name
      .replace(INVALID_SHEET_NAME_CHARACTERS, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 31) || "Account";

  let sheetName = cleanedName;
  let suffix = 2;

  while (usedNames.has(sheetName.toLowerCase())) {
    const suffixText = ` (${suffix})`;

    sheetName = cleanedName.slice(0, 31 - suffixText.length) + suffixText;

    suffix += 1;
  }

  usedNames.add(sheetName.toLowerCase());

  return sheetName;
}
