import type { HTMLAttributes } from "react";

export type BadgeVariant =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const variantClasses: Record<BadgeVariant, string> = {
  neutral: [
    "border-slate-200",
    "bg-slate-100",
    "text-slate-700",
    "dark:border-slate-700",
    "dark:bg-slate-800",
    "dark:text-slate-300",
  ].join(" "),

  primary: [
    "border-emerald-200",
    "bg-emerald-50",
    "text-emerald-700",
    "dark:border-emerald-900",
    "dark:bg-emerald-950/40",
    "dark:text-emerald-300",
  ].join(" "),

  success: [
    "border-green-200",
    "bg-green-50",
    "text-green-700",
    "dark:border-green-900",
    "dark:bg-green-950/40",
    "dark:text-green-300",
  ].join(" "),

  warning: [
    "border-amber-200",
    "bg-amber-50",
    "text-amber-700",
    "dark:border-amber-900",
    "dark:bg-amber-950/40",
    "dark:text-amber-300",
  ].join(" "),

  danger: [
    "border-red-200",
    "bg-red-50",
    "text-red-700",
    "dark:border-red-900",
    "dark:bg-red-950/40",
    "dark:text-red-300",
  ].join(" "),
};

export default function Badge({
  variant = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      {...props}
      className={[
        "inline-flex items-center gap-1",
        "whitespace-nowrap rounded-full",
        "border px-2.5 py-1",
        "text-xs font-medium",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );
}
