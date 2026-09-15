import type { ReactNode } from "react";

import TableCell from "./TableCell";
import TableRow from "./TableRow";

export type TableEmptyRowProps = {
  colSpan: number;
  children?: ReactNode;
};

export default function TableEmptyRow({
  colSpan,
  children = "No records found.",
}: TableEmptyRowProps) {
  return (
    <TableRow>
      <TableCell
        colSpan={colSpan}
        className="
          px-6 py-14
          text-center
          text-sm font-normal
          text-slate-500
          dark:text-slate-400
        "
      >
        {children}
      </TableCell>
    </TableRow>
  );
}
