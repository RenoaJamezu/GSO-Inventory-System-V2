import type { TdHTMLAttributes } from "react";

export type TableCellProps = TdHTMLAttributes<HTMLTableCellElement>;

export default function TableCell({
  className = "",
  ...props
}: TableCellProps) {
  return (
    <td
      {...props}
      className={[
        "px-4 py-3",
        "text-sm",
        "text-slate-700",
        "dark:text-slate-300",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
