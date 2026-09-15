import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    "bg-emerald-700 text-white",
    "hover:bg-emerald-800",
    "focus-visible:ring-emerald-600",
    "dark:bg-emerald-600",
    "dark:hover:bg-emerald-500",
    "dark:focus-visible:ring-emerald-500",
  ].join(" "),

  secondary: [
    "border border-slate-300",
    "bg-white text-slate-700",
    "hover:bg-slate-50",
    "focus-visible:ring-slate-400",
    "dark:border-slate-700",
    "dark:bg-slate-900",
    "dark:text-slate-200",
    "dark:hover:bg-slate-800",
    "dark:focus-visible:ring-slate-600",
  ].join(" "),

  danger: [
    "bg-red-700 text-white",
    "hover:bg-red-800",
    "focus-visible:ring-red-600",
    "dark:bg-red-700",
    "dark:hover:bg-red-600",
  ].join(" "),

  ghost: [
    "text-slate-600",
    "hover:bg-slate-100",
    "hover:text-slate-900",
    "focus-visible:ring-slate-300",
    "dark:text-slate-300",
    "dark:hover:bg-slate-800",
    "dark:hover:text-white",
    "dark:focus-visible:ring-slate-700",
  ].join(" "),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-8 px-3 py-1.5 text-xs",
  md: "min-h-10 px-4 py-2 text-sm",
  lg: "min-h-11 px-5 py-2.5 text-sm",
};

export default function Button({
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  loadingText = "Loading...",
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      type={type}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={[
        "inline-flex items-center justify-center gap-2",
        "rounded-md font-medium",
        "transition-colors duration-150",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed",
        "disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? loadingText : children}
    </button>
  );
}
