import type { HTMLAttributes } from "react";

export type DialogFooterProps = HTMLAttributes<HTMLDivElement>;

export default function DialogFooter({
  className = "",
  ...props
}: DialogFooterProps) {
  return (
    <div
      {...props}
      className={[
        "flex shrink-0",
        "items-center justify-end gap-2",
        "border-t border-slate-200",
        "bg-slate-50",
        "px-5 py-4",
        "dark:border-slate-800",
        "dark:bg-slate-900",
        "sm:px-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
