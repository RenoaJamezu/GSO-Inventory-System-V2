import type { ThHTMLAttributes } from "react";

export type TableHeaderCellProps = ThHTMLAttributes<HTMLTableCellElement>;

export default function TableHeaderCell({
  className = "",
  scope = "col",
  ...props
}: TableHeaderCellProps) {
  return (
    <th
      {...props}
      scope={scope}
      className={[
        "whitespace-nowrap",
        "px-4 py-3",
        "text-left",
        "text-xs font-semibold",
        "uppercase tracking-wide",
        "text-slate-500",
        "dark:text-slate-400",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
