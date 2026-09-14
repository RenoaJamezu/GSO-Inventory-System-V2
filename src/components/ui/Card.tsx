import type { HTMLAttributes, ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
};

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export default function Card({
  children,
  padding = "md",
  className = "",
  ...props
}: Props) {
  return (
    <div
      {...props}
      className={[
        "rounded-lg border",
        "border-slate-200 bg-white",
        "dark:border-slate-800 dark:bg-slate-900",
        paddingClasses[padding],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
