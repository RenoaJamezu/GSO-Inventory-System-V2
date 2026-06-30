import type { SelectHTMLAttributes } from "react";

type Props = SelectHTMLAttributes<HTMLSelectElement>;

export default function FormSelect({
  className = "",
  children,
  ...props
}: Props) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-gray-300 px-3 py-2 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${className}`}
    >
      {children}
    </select>
  );
}
