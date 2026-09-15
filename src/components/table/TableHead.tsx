import type { HTMLAttributes } from "react";

export type TableHeadProps = HTMLAttributes<HTMLTableSectionElement>;

export default function TableHead({
  className = "",
  ...props
}: TableHeadProps) {
  return (
    <thead
      {...props}
      className={["sticky top-0 z-10", className].filter(Boolean).join(" ")}
    />
  );
}
