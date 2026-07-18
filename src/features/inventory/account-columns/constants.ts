import type { ColumnDataType } from "./types";

export const ACCOUNT_COLUMNS_TABLE = "account_columns";

export const ACCOUNT_COLUMNS_VIEW = "account_columns_view";

export const DATA_TYPES: {
  value: ColumnDataType;
  label: string;
}[] = [
  {
    value: "text",
    label: "Single Line Text",
  },
  {
    value: "textarea",
    label: "Paragraph",
  },
  {
    value: "number",
    label: "Number",
  },
  {
    value: "date",
    label: "Date",
  },
  {
    value: "boolean",
    label: "Checkbox",
  },
];