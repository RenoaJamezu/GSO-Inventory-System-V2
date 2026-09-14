import type { MouseEventHandler, ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  danger?: boolean;
};

export default function DropdownItem({
  children,
  onClick,
  danger = false,
}: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition-colors",

        danger
          ? [
              "text-red-700 hover:bg-red-50",
              "dark:text-red-400 dark:hover:bg-red-950/40",
            ].join(" ")
          : [
              "text-slate-700 hover:bg-slate-50",
              "dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white",
            ].join(" "),
      ].join(" ")}
    >
      {children}
    </button>
  );
}
