import type { HTMLAttributes, ReactNode } from "react";

import { useDropdown } from "./DropdownContext";

export type DropdownContentProps = Omit<
  HTMLAttributes<HTMLDivElement>,
  "children"
> & {
  children: ReactNode;
  align?: "start" | "end";
};

export default function DropdownContent({
  children,
  align = "end",
  className = "",
  ...props
}: DropdownContentProps) {
  const { isOpen } = useDropdown();

  if (!isOpen) return null;

  return (
    <div
      {...props}
      role="menu"
      className={[
        "absolute z-50 mt-2 min-w-56",
        "overflow-hidden rounded-md border py-1",
        "border-slate-200 bg-white shadow-lg",
        "dark:border-slate-700",
        "dark:bg-slate-900",
        "dark:shadow-black/30",
        align === "start" ? "left-0" : "right-0",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
