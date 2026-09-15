import type { ButtonHTMLAttributes, MouseEvent } from "react";

import { useDropdown } from "./DropdownContext";

export type DropdownItemVariant = "default" | "danger";

export type DropdownItemProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: DropdownItemVariant;
};

const variantClasses: Record<DropdownItemVariant, string> = {
  default: [
    "text-slate-700",
    "hover:bg-slate-50",
    "dark:text-slate-300",
    "dark:hover:bg-slate-800",
    "dark:hover:text-white",
  ].join(" "),

  danger: [
    "text-red-700",
    "hover:bg-red-50",
    "dark:text-red-400",
    "dark:hover:bg-red-950/40",
  ].join(" "),
};

export default function DropdownItem({
  variant = "default",
  className = "",
  disabled,
  onClick,
  ...props
}: DropdownItemProps) {
  const { close } = useDropdown();

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);

    if (!event.defaultPrevented) {
      close();
    }
  };

  return (
    <button
      {...props}
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={handleClick}
      className={[
        "flex w-full items-center gap-2",
        "px-3 py-2.5",
        "text-left text-sm",
        "transition-colors duration-150",
        "focus-visible:outline-none",
        "focus-visible:bg-slate-100",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        "dark:focus-visible:bg-slate-800",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
