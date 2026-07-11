import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  onClick?: () => void;
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
        "flex w-full items-center px-4 py-2.5 text-left text-sm transition-colors",
        danger ? "text-red-600 hover:bg-red-50" : "hover:bg-gray-100",
      ].join(" ")}
    >
      {children}
    </button>
  );
}
