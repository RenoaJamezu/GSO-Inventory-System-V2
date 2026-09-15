import type { HTMLAttributes } from "react";

export type CardProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className = "", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={[
        "rounded-lg border",
        "border-slate-200 bg-white",
        "dark:border-slate-800 dark:bg-slate-900",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
