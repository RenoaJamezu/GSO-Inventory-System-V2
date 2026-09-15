import type { HTMLAttributes, TableHTMLAttributes } from "react";

export type TableContainerProps = HTMLAttributes<HTMLDivElement>;

export type TableProps = TableHTMLAttributes<HTMLTableElement>;

export function TableContainer({
  className = "",
  ...props
}: TableContainerProps) {
  return (
    <div
      {...props}
      className={[
        "overflow-auto",
        "rounded-lg border",
        "border-slate-200",
        "bg-white",
        "dark:border-slate-800",
        "dark:bg-slate-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}

export default function Table({ className = "", ...props }: TableProps) {
  return (
    <table
      {...props}
      className={["min-w-full border-collapse", className]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
