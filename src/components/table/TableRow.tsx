import type { HTMLAttributes } from "react";

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>;

export default function TableRow({ className = "", ...props }: TableRowProps) {
  return <tr {...props} className={className} />;
}
