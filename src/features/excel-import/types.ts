import type * as XLSX from "xlsx";

export type ExcelWorkbook = XLSX.WorkBook;

export type ExcelRow = Record<string, unknown>;

export type ColumnMapping = {
  excelColumn: string;
  fieldKey: string;
};

export type ParsedWorksheet = {
  sheetName: string;
  rows: ExcelRow[];
};
