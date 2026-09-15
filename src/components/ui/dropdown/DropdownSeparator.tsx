import type { HTMLAttributes } from "react";

export type DropdownSeparatorProps = HTMLAttributes<HTMLDivElement>;

export default function DropdownSeparator({
  className = "",
  ...props
}: DropdownSeparatorProps) {
  return (
    <div
      {...props}
      role="separator"
      className={[
        "my-1 border-t",
        "border-slate-200",
        "dark:border-slate-700",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
