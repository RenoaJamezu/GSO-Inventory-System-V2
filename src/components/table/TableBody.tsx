import type { HTMLAttributes } from "react";

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>;

export default function TableBody({
  className = "",
  ...props
}: TableBodyProps) {
  return (
    <tbody
      {...props}
      className={[
        "divide-y divide-slate-100",
        "dark:divide-slate-800",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
